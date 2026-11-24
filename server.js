// Stayline: a tiny hotel booking app used as the system under test. Zero dependencies.
import { createServer } from 'node:http';
import { NOW, cancel, listBookings, reset, walletBalance } from './src/store.js';
import { hoursUntil } from './src/policy.js';

const PORT = Number(process.env.PORT ?? 3000);

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const fmtDate = (d) =>
  d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';

function statusCell(b) {
  if (b.status === 'active') {
    return `<form method="post" action="/bookings/${b.id}/cancel">
      <button type="submit" aria-label="Cancel ${escape(b.guest)}'s booking">Cancel booking</button>
    </form>`;
  }
  const outcome = b.refunded > 0 ? `Refunded ${b.refunded} €` : 'No refund';
  return `<span class="cancelled" data-testid="outcome-${b.id}">Cancelled · ${outcome}</span>`;
}

function page(flash) {
  const rows = listBookings()
    .map((b) => `<tr>
      <td>#${b.id}</td>
      <td>${escape(b.guest)}</td>
      <td>${escape(b.room)}</td>
      <td>${fmtDate(b.checkIn)}<br><small>Check-in in ${Math.round(hoursUntil(b.checkIn, NOW))} h</small></td>
      <td>${b.price} €</td>
      <td>${statusCell(b)}</td>
    </tr>`)
    .join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stayline · My bookings</title>
<style>
  :root { --ink:#1d2433; --muted:#5b6475; --line:#e3e6ec; --accent:#1f6f5c; --warn:#a4372a; }
  * { box-sizing: border-box; }
  body { margin:0; font:16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color:var(--ink); background:#f7f8fa; }
  header { background:#fff; border-bottom:1px solid var(--line); padding:16px 24px; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
  h1 { font-size:20px; margin:0; }
  main { max-width:960px; margin:24px auto; padding:0 24px; }
  .meta { color:var(--muted); font-size:14px; }
  .wallet { font-weight:600; }
  .flash { background:#fff; border:1px solid var(--line); border-left:4px solid var(--accent); padding:12px 16px; margin-bottom:16px; }
  .flash.none { border-left-color:var(--warn); }
  table { width:100%; border-collapse:collapse; background:#fff; border:1px solid var(--line); }
  th, td { text-align:left; padding:12px; border-bottom:1px solid var(--line); vertical-align:top; }
  th { font-size:13px; color:var(--muted); font-weight:600; }
  small { color:var(--muted); }
  button { font:inherit; padding:6px 12px; border:1px solid var(--warn); color:var(--warn); background:#fff; border-radius:6px; cursor:pointer; }
  .cancelled { font-weight:600; }
  footer { margin-top:16px; font-size:14px; }
</style>
</head>
<body>
<header>
  <h1>Stayline · My bookings</h1>
  <div>
    <div class="meta">Demo clock: ${fmtDate(NOW)}</div>
    <div class="wallet" data-testid="wallet">Wallet balance: ${walletBalance()} €</div>
  </div>
</header>
<main>
  ${flash ? `<div class="flash ${flash.refunded > 0 ? '' : 'none'}" role="status">Booking #${flash.id} for ${escape(flash.guest)} cancelled. ${flash.refunded > 0 ? `Refunded ${flash.refunded} €.` : 'No refund.'}</div>` : ''}
  <table>
    <thead><tr><th>Booking</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Price</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <footer><a href="/reset">Reset demo data</a></footer>
</main>
</body>
</html>`;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'content-type': 'text/html; charset=utf-8', ...headers });
  res.end(body);
}

export const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/') {
    const id = Number(url.searchParams.get('cancelled'));
    const flash = id ? listBookings().find((b) => b.id === id && b.status === 'cancelled') : null;
    return send(res, 200, page(flash));
  }

  if (url.pathname === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'GET' && url.pathname === '/reset') {
    reset();
    return send(res, 303, '', { location: '/' });
  }

  const match = url.pathname.match(/^\/bookings\/(\d+)\/cancel$/);
  if (req.method === 'POST' && match) {
    const booking = cancel(Number(match[1]));
    return send(res, 303, '', { location: booking ? `/?cancelled=${booking.id}` : '/' });
  }

  send(res, 404, 'Not found');
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, () => console.log(`Stayline running on http://localhost:${PORT}`));
}
