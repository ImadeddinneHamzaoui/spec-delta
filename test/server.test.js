import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../server.js';

let base;
before(async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const get = (path) => fetch(base + path, { redirect: 'manual' });
const cancel = (id) => fetch(`${base}/bookings/${id}/cancel`, { method: 'POST', redirect: 'manual' });

test('lists the four seeded bookings with an empty wallet', async () => {
  await get('/reset');
  const html = await (await get('/')).text();
  for (const guest of ['Amina', 'Bilal', 'Chloé', 'Driss']) assert.match(html, new RegExp(guest));
  assert.match(html, /Wallet balance: 0 €/);
});

test('cancelling redirects to a confirmation and credits the wallet', async () => {
  await get('/reset');
  const res = await cancel(1);
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), '/?cancelled=1');
  const html = await (await get('/?cancelled=1')).text();
  assert.match(html, /Booking #1 for Amina cancelled\. Refunded 120 €\./);
  assert.match(html, /Wallet balance: 120 €/);
});

test('cancelling twice does not refund twice', async () => {
  await get('/reset');
  await cancel(1);
  await cancel(1);
  assert.match(await (await get('/')).text(), /Wallet balance: 120 €/);
});
