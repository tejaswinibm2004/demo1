# amazin — demo storefront

A polished Amazon-style demo shop with deliberately planted bugs. Self-contained: push this folder as its own GitHub repo.

## Run locally

```bash
cp config.example.js config.js
# put your ingestion key in config.js -> window.BUGSHIELD_KEY
python -m http.server 5173
# or use the root repo: npm run demo
```

## Deploy

Create a Render **Static Site** from this repo using the included `render.yaml`. Set `BUGSHIELD_KEY` (from dashboard → Websites → New key). The build script writes `config.js` and `version.json` from `RENDER_GIT_COMMIT`.

## Bugs to report

1. Navbar says **"Shoping Cart"** instead of "Shopping Cart".
2. Checkout total is shown with a **€** symbol on a dollar store.
3. Cart badge count does not update after adding an item.
4. All products hard-code "(128 reviews)".
5. Search has no empty-query guard.
6. Cart is not cleared after checkout.

Best first demo: report the "Shoping Cart" typo — a non-critical zero-click fix shipped by commit, verified through `version.json`.

`PLANTED_BUGS.md` and `all-bug.md` are local-only answer keys and are gitignored.
