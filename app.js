// Amazin demo storefront — intentionally buggy. Answer keys are gitignored.
const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', art: '🎧', price: 39.99, rating: 4.6, cat: 'tech', tag: 'Bestseller', tint: 'linear-gradient(135deg,#e8e0ff,#cfc0ff)' },
  { id: 2, name: 'Mechanical Keyboard', art: '⌨️', price: 59.50, rating: 4.8, cat: 'tech', tag: 'Top rated', tint: 'linear-gradient(135deg,#dff3ef,#b9e8dc)' },
  { id: 3, name: 'USB-C Hub', art: '🔌', price: 24.00, rating: 4.2, cat: 'tech', tag: '', tint: 'linear-gradient(135deg,#e6ecff,#c8d8ff)' },
  { id: 4, name: 'Desk Lamp', art: '💡', price: 18.75, rating: 4.4, cat: 'home', tag: 'New', tint: 'linear-gradient(135deg,#fff1d6,#ffdba1)' },
  { id: 5, name: 'Ceramic Mug', art: '☕', price: 9.25, rating: 4.9, cat: 'home', tag: '', tint: 'linear-gradient(135deg,#ffe6e0,#ffc9bd)' },
  { id: 6, name: 'Notebook Set', art: '📓', price: 12.99, rating: 4.1, cat: 'office', tag: '', tint: 'linear-gradient(135deg,#e8f0ff,#cbdcff)' },
  { id: 7, name: 'Laptop Stand', art: '💻', price: 32.50, rating: 4.5, cat: 'office', tag: 'Popular', tint: 'linear-gradient(135deg,#e9e6ff,#d3ccff)' },
  { id: 8, name: 'Webcam 1080p', art: '📷', price: 45.00, rating: 3.9, cat: 'tech', tag: '', tint: 'linear-gradient(135deg,#e2f4f6,#bfe6ec)' },
];

let cart = [];
let activeCat = 'all';
let query = '';
const money = (n) => '$' + n.toFixed(2);

function renderProducts() {
  const list = PRODUCTS.filter((p) => (activeCat === 'all' || p.cat === activeCat) && p.name.toLowerCase().includes(query));
  document.getElementById('productGrid').innerHTML = list.map((p, idx) => `<article class="product" style="--i:${idx * 40}ms">
    <div class="art" style="background:${p.tint}">
      ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}${p.art}
    </div>
    <h3>${p.name}</h3>
    <div class="rate">★ <b>${p.rating}</b> (128 reviews)</div>
    <div class="price">${money(p.price)}</div>
    <button class="add" data-add="${p.id}"><i data-lucide="plus"></i> Add to cart</button>
  </article>`).join('');
  document.getElementById('resultCount').textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;
  window.lucide?.createIcons();
  document.querySelectorAll('[data-add]').forEach((b) => b.onclick = () => addToCart(Number(b.dataset.add)));
}

function addToCart(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const line = cart.find((x) => x.id === id);
  if (line) line.qty += 1; else cart.push({ ...p, qty: 1 });
  // PLANTED BUG #3: the badge count is not refreshed here.
  toast(`${p.name} added to your cart`);
}

function renderCart() {
  const items = document.getElementById('cartItems');
  items.innerHTML = cart.length ? cart.map((l) => `<div class="cart-row">
    <div class="ci">${l.art}</div><div class="cn">${l.name}<div class="cq">Qty ${l.qty} · ${money(l.price)}</div></div>
    <b>${money(l.price * l.qty)}</b></div>`).join('')
    : '<div style="padding:40px 0;text-align:center;color:#8893a8;font-size:13px">Your cart is empty.<br>Add something you like.</div>';
  document.getElementById('cartTotal').textContent = money(cart.reduce((s, l) => s + l.price * l.qty, 0));
  document.getElementById('cartCount').textContent = String(cart.reduce((s, l) => s + l.qty, 0));
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('drawerBackdrop').classList.add('open');
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
}

function checkout() {
  const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
  // PLANTED BUG #2: euro symbol on a dollar store.
  alert('Total due: €' + total.toFixed(2));
}

function toast(msg) {
  const old = document.querySelector('.toast'); if (old) old.remove();
  const el = document.createElement('div'); el.className = 'toast';
  el.innerHTML = `<i data-lucide="check-circle-2"></i><span>${msg}</span>`;
  document.body.appendChild(el); window.lucide?.createIcons();
  setTimeout(() => el.remove(), 2200);
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  window.lucide?.createIcons();
  document.getElementById('cartBtn').onclick = renderCart;
  document.getElementById('closeCart').onclick = closeCart;
  document.getElementById('drawerBackdrop').onclick = closeCart;
  document.getElementById('checkoutBtn').onclick = checkout;
  document.getElementById('searchBtn').onclick = () => { query = document.getElementById('q').value.toLowerCase(); renderProducts(); };
  document.getElementById('q').addEventListener('keydown', (e) => { if (e.key === 'Enter') document.getElementById('searchBtn').click(); });
  document.querySelectorAll('[data-cat]').forEach((b) => b.onclick = () => {
    document.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('active', x === b));
    activeCat = b.dataset.cat; renderProducts();
  });
  const build = window.BUGSHIELD_BUILD_INFO || {};
  document.getElementById('buildInfo').textContent = `build ${build.commit || 'local'}`;
  // Always render the widget. Fall back to the deployed dashboard when config.js
  // still contains the local/placeholder value (otherwise HTTPS blocks the script).
  const configuredEndpoint = window.BUGSHIELD_ENDPOINT || '';
  const endpoint = (!configuredEndpoint || /localhost|127\.0\.0\.1|REPLACE/i.test(configuredEndpoint))
    ? (['localhost', '127.0.0.1'].includes(location.hostname)
        ? 'http://localhost:10000/sdk/bugshield.js'
        : 'https://multiagentnew.onrender.com/sdk/bugshield.js')
    : configuredEndpoint;
  const widgetKey = /REPLACE/i.test(window.BUGSHIELD_KEY || '') ? '' : (window.BUGSHIELD_KEY || '');
  const s = document.createElement('script');
  s.src = endpoint;
  if (widgetKey) s.setAttribute('data-key', widgetKey);
  s.async = true;
  document.body.appendChild(s);
});
