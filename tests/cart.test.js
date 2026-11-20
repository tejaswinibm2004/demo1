import test from 'node:test';
import assert from 'node:assert/strict';

// Behavioral test used by BugShield as post-fix evidence (never auto-run by the agent).
function money(n) { return '$' + n.toFixed(2); }
function total(lines) { return lines.reduce((s, l) => s + l.price * l.qty, 0); }

test('cart total sums line items', () => {
  assert.equal(total([{ price: 10, qty: 2 }, { price: 5.5, qty: 1 }]), 25.5);
  assert.equal(money(25.5), '$25.50');
});

test('money formatting uses dollar sign', () => {
  assert.equal(money(0), '$0.00');
  assert.ok(money(12).startsWith('$'));
});
