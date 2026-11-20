// Amazin demo storefront — intentionally contains planted bugs for BugShield to find.
// Answer keys live in PLANTED_BUGS.md / all-bug.md (gitignored).
const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', art: '🎧', price: 39.99, rating: 4.6 },
  { id: 2, name: 'Mechanical Keyboard', art: '⌨️', price: 59.5, rating: 4.8 },
  { id: 3, name: 'USB-C Hub', art: '🔌', price: 24.0, rating: 4.2 },
  { id: 4, name: 'Desk Lamp', art: '💡', price: 18.75, rating: 4.4 },
  { id: 5, name: 'Ceramic Mug', art: '☕', price: 9.25, rating: 4.9 },
  { id: 6, name: 'Notebook Set', art: '📓', price: 12.99, rating: 4.1 },
  { id: 7, name: 'Laptop Stand', art: '💻', price: 32.5, rating: 4.5 },
  { id: 8, name: 'Webcam 1080p', art: '📷', price: 45.0, rating: 3.9 },
];

let cart = [];

function money(n) { return '$' + n.toFixed(2); }

function renderProducts(list = PRODUCTS) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = list.map((p) => `<article class="card" data-id="${p.id}">
    <div class="art">${p.art}</div><h3>${p.name}</h3>
    <div class="stars">★ ${p.rating} (128)</div>
    <div class="price">${money(p.price)}</div>
    <button class="add" data-add="${p.id}">Add to cart</button>
  </article>`).join('');
  document.getElementById('resultCount').textContent = `${list.length} items`;
  grid.querySelectorAll('[data-add]').forEach((b) => b.onclick = () => addToCart(Number(b.dataset.add)));
}

function addToCart(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const line = cart.find((x) => x.id === id);
  if (line) line.qty += 1; else cart.push({ ...p, qty: 1 });
  // BUG: cart badge is not refreshed here (bug #3).
  toast('Added to cart');
}

function renderCart() {
  const panel = document.getElementById('cartPanel');
  const items = document.getElementById('cartItems');
  if (!cart.length) { items.innerHTML = '<p class="dim">Your cart is empty.</p>'; }
  else {
    items.innerHTML = cart.map((l) => `<div class="cart-row"><span>${l.art} ${l.name} × ${l.qty}</span><b>${money(l.price * l.qty)}</b></div>`).join('');
  }
  document.getElementById('cartTotal').textContent = money(cart.reduce((s, l) => s + l.price * l.qty, 0));
  document.getElementById('cartCount').textContent = String(cart.reduce((s, l) => s + l.qty, 0));
  panel.hidden = false;
}

function checkout() {
  const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
  // BUG: wrong currency symbol on checkout total (bug #2).
  alert('Total due: €' + total.toFixed(2));
}

function search() {
  const q = document.getElementById('q').value.toLowerCase();
  renderProducts(PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)));
}

function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.style.cssText = 'position:fixed;bottom:22px;right:22px;background:#17202e;color:#fff;padding:12px 18px;border-radius:9px;z-index:99'; document.body.appendChild(t); }
  t.textContent = msg;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.remove(), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  document.getElementById('cartBtn').onclick = renderCart;
  document.getElementById('closeCart').onclick = () => document.getElementById('cartPanel').hidden = true;
  document.getElementById('checkoutBtn').onclick = checkout;
  document.getElementById('searchBtn').onclick = search;
  document.getElementById('q').addEventListener('keydown', (e) => { if (e.key === 'Enter') search(); });
  const build = window.BUGSHIELD_BUILD_INFO || {};
  document.getElementById('buildInfo').textContent = `build ${build.commit || 'local'}`;

  // BugShield feedback widget (endpoint + key injected by scripts/build.mjs).
  if (window.BUGSHIELD_ENDPOINT && window.BUGSHIELD_KEY) {
    const s = document.createElement('script');
    s.src = window.BUGSHIELD_ENDPOINT; s.setAttribute('data-key', window.BUGSHIELD_KEY);
    s.async = true; document.body.appendChild(s);
  }
});
