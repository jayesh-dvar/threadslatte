import { NextResponse } from "next/server";
import { normalizeShopifyProduct, productQuery, shopifyRequest, type ShopifyProduct } from "../../../../lib/shopify";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") || undefined;
  try {
    const data = await shopifyRequest<{ products: { nodes: ShopifyProduct[] } }>(productQuery, { first: 24, query });
    if (!data) return NextResponse.json({ products: [], connected: false }, { status: 503 });
    return NextResponse.json({ products: data.products.nodes.map(normalizeShopifyProduct), connected: true });
  } catch (error) {
    return NextResponse.json({ products: [], connected: false, error: error instanceof Error ? error.message : "Shopify unavailable" }, { status: 502 });
  }
}
