# Threads & Latte storefront

The homepage runs against the existing Shopify store. Without Shopify credentials it renders the current scraped catalogue as a realistic preview; with the environment variables in `.env.example`, the product grid and add-to-bag flow switch to live Shopify data.

## Shopify connection

1. Copy `.env.example` to `.env.local`.
2. Add the store domain and a Storefront API token from Shopify Admin.
3. Keep the Storefront API token scoped to product read and cart access; do not put an Admin API token in the browser.

The integration surface is intentionally small:

- `GET /api/shopify/products` reads live products, variants, prices, images, and availability.
- `POST /api/shopify/cart` creates a cart or adds a variant to an existing cart, then returns Shopify’s checkout URL.
- `lib/shopify.ts` owns the GraphQL queries and product normalization layer.

Product detail pages can use each product `handle` with Shopify’s `product(handle:)` query, while collections can use `collection(handle:)`. Customer accounts, returns, shipping rules, discounts, and order management remain in Shopify Admin/Checkout rather than being duplicated in this frontend.

## Local commands

```bash
npm install
npm run dev
npm run build
npm test
```
