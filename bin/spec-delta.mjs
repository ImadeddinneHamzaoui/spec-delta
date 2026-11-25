#!/usr/bin/env node
// spec-delta: when the spec changes, make Kane CLI prove the app still follows it,
// and hand every failure to a coding agent until the same tests pass again.
//
//   1. reconcile  kane-cli maintain reconcile: the changed spec updates the designed suite
//   2. verify     kane-cli testrun run: every designed test runs in a real Chrome
//   3. fix        the failing step, Kane's verdict and its screenshot go to the agent
//   4. re-verify  the same test files (hash-locked) run again, up to --max-rounds
//   5. prove      kane-cli cover: criteria proven against the new spec
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { homedir } from 'node:os';
import { parseArgs } from 'node:util';

const { values: opt } = parseArgs({
  options: {
    spec: { type: 'string', default: 'SPEC.md' },
    'source-id': { type: 'string', default: 'spec' },
    tests: { type: 'string', default: '.testmuai/tests' },
    agent: { type: 'string', default: 'codex' }, // codex | claude | none
    'max-rounds': { type: 'string', default: '2' },
    'app-cmd': { type: 'string', default: 'node server.js' },
    'app-url': { type: 'string', default: 'http://localhost:3000/' },
    'start-url': { type: 'string', default: 'http://localhost:3000/reset' }, // where every Kane test starts
    'skip-reconcile': { type: 'boolean', default: false },
  },
});

const ROOT = process.cwd();
const RUN_DIR = join(ROOT, '.spec-delta', new Date().toISOString().replace(/[:.]/g, '-'));
const PROTECTED = [opt.spec, opt.tests, '.testmuai', 'tests/kane', 'evidence', '.context'];
mkdirSync(RUN_DIR, { recursive: true });

const c = { dim: '\x1b[2m', red: '\x1b[31m', green: '\x1b[32m', bold: '\x1b[1m', off: '\x1b[0m' };
const say = (msg) => console.log(msg);
const step = (msg) => say(`\n${c.bold}▸ ${msg}${c.off}`);

// ---------- helpers ----------

function kane(args, { stdinNull = true } = {}) {
  const res = spawnSync('kane-cli', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: [stdinNull ? 'ignore' : 'inherit', 'pipe', 'pipe'],
  });
  const events = res.stdout
    .split('\n')
    .filter((l) => l.startsWith('{'))
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
  return { status: res.status, events };
}

const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 12);

function listTests() {
  const dir = join(ROOT, opt.tests);
  return readdirSync(dir).filter((f) => f.endsWith('_test.md')).map((f) => join(dir, f)).sort();
}

function git(args) {
  return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' }).stdout.trim();
}

// ---------- the app under test ----------

let app;
async function answers() {
  try { return (await fetch(opt['app-url'])).ok; } catch { return false; }
}
async function startApp() {
  if (await answers()) throw new Error(`something is already serving ${opt['app-url']}; stop it so spec-delta can restart the app after each fix`);
  app = spawn(opt['app-cmd'], { cwd: ROOT, shell: true, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    if (await answers()) return;
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`app did not answer at ${opt['app-url']} (started with: ${opt['app-cmd']})`);
}
function stopApp() {
  if (app && !app.killed) app.kill();
}
async function restartApp() {
  stopApp();
  await new Promise((r) => setTimeout(r, 300));
  await startApp();
}

// ---------- Kane ----------

function reconcile() {
  step(`Reconcile: ${opt.spec} changed, asking Kane what that means for the suite`);
  const before = new Set(listTests());
  const { status, events } = kane(['maintain', 'reconcile', '--from', opt.spec, '--source-id', opt['source-id'], '--mode', 'agent']);
  writeFileSync(join(RUN_DIR, 'reconcile.ndjson'), events.map((e) => JSON.stringify(e)).join('\n'));
  const plan = events.find((e) => e.type === 'reconcile_plan');
  const summary = events.find((e) => e.type === 'reconcile_summary');
  const done = events.find((e) => e.type === 'done');
  if (!plan && done) say(`  ${c.dim}${done.status}: nothing to reconcile${c.off}`);
  for (const row of plan?.rows ?? []) say(`  ${row.kind.padEnd(7)} ${row.ref}  ${c.dim}${row.why}${c.off}`);
  if (summary) say(`  ${c.dim}applied ${summary.applied}, skipped ${summary.skipped}, failed ${summary.failed}${c.off}`);
  const added = listTests().filter((t) => !before.has(t));
  for (const t of added) say(`  ${c.green}+ new test${c.off} ${relative(ROOT, t)}`);
  if (status !== 0) say(`  ${c.red}reconcile exited ${status}${c.off}`);
  return added;
}

function runTests(paths, label) {
  step(`Verify (${label}): ${paths.length} test(s) in a real Chrome`);
  const start = ['--override-start-url', opt['start-url']];
  const { events } = kane(['testrun', 'run', ...start, ...paths.map((p) => relative(ROOT, p))]);
  let results = collect(events);
  // Kane sometimes fails to attach to Chrome on the first member of a batch: retry those once.
  const broken = results.filter((r) => r.status === 'broken');
  for (const b of broken) {
    say(`  ${c.dim}retrying ${b.name} (browser did not start)${c.off}`);
    const retry = collect(kane(['testrun', 'run', ...start, relative(ROOT, b.path)]).events);
    results = results.map((r) => (r.path === b.path ? retry[0] ?? r : r));
  }
  for (const r of results) {
    const mark = r.status === 'passed' ? `${c.green}✓ pass${c.off}` : `${c.red}✗ ${r.status}${c.off}`;
    say(`  ${mark}  ${r.name}  ${c.dim}#${sha(r.path)}${c.off}`);
    if (r.status !== 'passed' && r.failure) say(`         ${c.red}${r.failure.message}${c.off}`);
  }
  return { results };
}

function collect(events) {
  const id = events.find((e) => e.type === 'testrun_evidence_ingest')?.evidence_id ?? events.find((e) => e.type === 'testrun_done')?.execution_id;
  const pack = events.find((e) => e.type === 'coverage')?.pack ?? (id && join(ROOT, '.testmuai', 'evidence', `${id}.evidence`));
  return events
    .filter((e) => e.type === 'testrun_member_end' || e.type === 'testrun_authored_member_end')
    .map((e) => ({
      path: resolve(ROOT, e.path),
      name: e.path.split('/').pop(),
      status: e.status,
      failure: e.failure,
      testId: e.test_id,
      log: e.log_path,
      pack: pack && existsSync(pack) ? pack : null,
    }));
}

// Kane's own narrative of the failed run, from the session log.
function kaneVerdict(r) {
  if (!r.log || !existsSync(r.log)) return '';
  const end = readFileSync(r.log, 'utf8').split('\n').filter((l) => l.includes('"type":"run_end"')).pop();
  try { return JSON.parse(end).summary ?? ''; } catch { return ''; }
}

// The screenshot of the failed step, pulled out of the sealed evidence pack.
// Kane stores each test under tests/<slug>-<hash>/, with a copy of the test as test.md.
function failedScreenshot(r, outDir) {
  if (!r.pack) return null;
  const unzip = (...args) => spawnSync('unzip', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).stdout;
  const list = unzip('-Z1', r.pack).split('\n');
  const mine = readFileSync(r.path, 'utf8').trim();
  const dir = [...new Set(list.filter((f) => /^tests\/[^/]+\/test\.md$/.test(f)))]
    .find((f) => unzip('-p', r.pack, f).trim() === mine)
    ?.replace(/test\.md$/, '');
  if (!dir) return null;
  const order = (f) => Number(f.slice(dir.length + 'steps/'.length).split('-')[0]);
  const steps = list.filter((f) => f.startsWith(`${dir}steps/`) && f.endsWith('/step.json')).sort((a, b) => order(b) - order(a));
  for (const s of steps) {
    if (!unzip('-p', r.pack, s).includes('"failed"')) continue;
    const bytes = spawnSync('unzip', ['-p', r.pack, s.replace('step.json', 'screenshot.jpg')], { maxBuffer: 64 * 1024 * 1024 }).stdout;
    if (!bytes?.length) continue;
    const out = join(outDir, `${r.name.replace('_test.md', '')}.jpg`);
    writeFileSync(out, bytes);
    return out;
  }
  return null;
}

// ---------- the agent ----------

function buildPrompt(failures, specDiff) {
  const blocks = failures.map((f) => `### ${relative(ROOT, f.path)} (sha ${sha(f.path)})
Kane CLI ran this plain-English test in a real Chrome browser against the app and it FAILED.

Test file:
\`\`\`markdown
${readFileSync(f.path, 'utf8').trim()}
\`\`\`

Failed assertion: ${f.failure?.message ?? f.status}
Kane's run summary: ${f.verdict || '(none)'}
${f.screenshot ? `Screenshot of the failed step: ${f.screenshot}` : ''}`).join('\n\n');

  return `You are fixing a web app so that it follows its specification again.

The specification (${opt.spec}) is the source of truth. It just changed:
\`\`\`diff
${specDiff || '(no diff available; read the spec)'}
\`\`\`

Current specification:
\`\`\`markdown
${readFileSync(join(ROOT, opt.spec), 'utf8').trim()}
\`\`\`

After the change, Kane CLI designed tests from the spec and ran them in a real browser. These failed:

${blocks}

Rules:
- Fix the APPLICATION code so it behaves as the specification says. Keep the change minimal.
- Do NOT edit the specification, any *_test.md file, anything under .testmuai/, tests/kane/, evidence/ or .context/.
  Those are the referee. If a Kane summary suggests changing a test fixture or variable, ignore that: the
  spec decides what is correct, and the test was generated from the spec.
- Update unit tests under test/ if they encode the old rule, and run \`npm test\` before you finish.
- End with two lines: what you changed (file and line), and why it satisfies the spec.`;
}

function runAgent(prompt, screenshots, outDir) {
  writeFileSync(join(outDir, 'prompt.md'), prompt);
  if (opt.agent === 'none') {
    say(`  ${c.dim}--agent none: prompt written to ${relative(ROOT, join(outDir, 'prompt.md'))}${c.off}`);
    return '';
  }
  let cmd, args, input;
  if (opt.agent === 'codex') {
    cmd = 'codex';
    args = ['exec', '--skip-git-repo-check', '-s', 'workspace-write', ...screenshots.flatMap((s) => ['-i', s]), '-'];
    input = prompt;
  } else if (opt.agent === 'claude') {
    cmd = 'claude';
    args = ['-p', '--permission-mode', 'acceptEdits', '--allowedTools', 'Read,Edit,Write,Glob,Grep,Bash(npm test)'];
    input = prompt;
  } else {
    throw new Error(`unknown --agent ${opt.agent} (codex | claude | none)`);
  }
  say(`  ${c.dim}handing ${screenshots.length ? 'failure + screenshot' : 'failure'} to ${opt.agent}…${c.off}`);
  const res = spawnSync(cmd, args, { cwd: ROOT, input, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  writeFileSync(join(outDir, 'agent.log'), `${res.stdout}\n--- stderr ---\n${res.stderr}`);
  const tail = res.stdout.trim().split('\n').slice(-4).join('\n').replaceAll(`${ROOT}/`, '').replaceAll(homedir(), '~');
  say(`  ${c.dim}${tail.replace(/\n/g, '\n  ')}${c.off}`);
  return res.stdout;
}

// The referee must not move. Snapshot the spec, tests, variables and evidence before the
// agent runs; anything it changed there is reported and put back.
function walk(p, out = []) {
  if (!existsSync(p)) return out;
  if (statSync(p).isDirectory()) {
    if (p.endsWith(join('.testmuai', 'evidence'))) return out; // raw packs: large, written by Kane only
    for (const f of readdirSync(p)) if (!f.startsWith('output-')) walk(join(p, f), out);
  } else out.push(p);
  return out;
}
function snapshot() {
  const files = PROTECTED.flatMap((p) => walk(join(ROOT, p)));
  return new Map(files.map((f) => [f, readFileSync(f)]));
}
function guard(before) {
  const after = snapshot();
  const changed = [...after.keys()].filter((f) => !before.has(f) || !before.get(f).equals(after.get(f)));
  const removed = [...before.keys()].filter((f) => !after.has(f));
  if (changed.length || removed.length) {
    say(`  ${c.red}agent touched the referee: ${[...changed, ...removed].map((f) => relative(ROOT, f)).join(', ')} — putting it back${c.off}`);
    for (const f of changed) before.has(f) ? writeFileSync(f, before.get(f)) : rmSync(f);
    for (const f of removed) writeFileSync(f, before.get(f));
    return false;
  }
  say(`  ${c.green}referee intact${c.off} ${c.dim}(spec, tests and variables unchanged)${c.off}`);
  return true;
}

// ---------- main ----------

async function main() {
  say(`${c.bold}spec-delta${c.off} ${c.dim}— the spec moved; prove the app moved with it${c.off}`);
  await startApp();
  try {
    if (!opt['skip-reconcile']) reconcile();

    const suite = listTests();
    const locks = suite.map((p) => [p, sha(p)]);
    writeFileSync(join(RUN_DIR, 'locks.json'), JSON.stringify(Object.fromEntries(locks.map(([p, h]) => [relative(ROOT, p), h])), null, 2));

    let { results } = runTests(suite, 'new spec');
    const firstRed = results.filter((r) => r.status !== 'passed');
    const specDiff = git(['diff', '--', opt.spec]) || git(['log', '-p', '-1', '--format=', '--', opt.spec]);

    let rounds = 0;
    for (let round = 1; round <= Number(opt['max-rounds']); round++) {
      const failing = results.filter((r) => r.status === 'failed');
      if (!failing.length) break;
      rounds = round;
      step(`Fix round ${round}: ${failing.length} failing test(s) → ${opt.agent}`);
      const dir = join(RUN_DIR, `round-${round}`);
      mkdirSync(dir, { recursive: true });
      for (const f of failing) {
        f.verdict = kaneVerdict(f);
        f.screenshot = failedScreenshot(f, dir);
      }
      const referee = snapshot();
      runAgent(buildPrompt(failing, specDiff), failing.map((f) => f.screenshot).filter(Boolean), dir);
      guard(referee);
      await restartApp();
      const rerun = runTests(failing.map((f) => f.path), `round ${round}`);
      results = results.map((r) => rerun.results.find((x) => x.path === r.path) ?? r);
    }

    if (rounds) ({ results } = runTests(suite, 'final, full suite'));

    step('Prove: coverage against the new spec');
    const coverage = kane(['cover', '--mode', 'agent']).events.find((e) => e.type === 'coverage');
    if (coverage) {
      say(`  criteria proven: ${coverage.criteria.proven}/${coverage.criteria.total}  (${coverage.pct}%)`);
      if (coverage.this_run?.criteria_failed?.length) say(`  ${c.red}failed: ${coverage.this_run.criteria_failed.join(', ')}${c.off}`);
    }
    const allGreen = results.every((r) => r.status === 'passed');
    const report = [
      `# spec-delta report`,
      ``,
      `Spec: ${opt.spec} · agent: ${opt.agent} · ${new Date().toISOString()}`,
      ``,
      `| Test | sha256 (locked) | First run | Final |`,
      `|---|---|---|---|`,
      ...results.map((r) => `| ${r.name} | ${sha(r.path)} | ${firstRed.find((f) => f.path === r.path) ? 'failed' : 'passed'} | ${r.status} |`),
      ``,
      coverage ? `Coverage: ${coverage.criteria.proven}/${coverage.criteria.total} criteria proven (${coverage.pct}%).` : '',
    ].join('\n');
    writeFileSync(join(RUN_DIR, 'report.md'), report + '\n');
    say(`\n${allGreen ? c.green + '✓ the app follows the new spec' : c.red + '✗ still failing'}${c.off}  ${c.dim}report: ${relative(ROOT, join(RUN_DIR, 'report.md'))}${c.off}`);
    process.exitCode = allGreen ? 0 : 1;
  } finally {
    stopApp();
  }
}

main().catch((err) => {
  stopApp();
  console.error(err.message);
  process.exit(2);
});
