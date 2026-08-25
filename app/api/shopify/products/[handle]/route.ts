import { NextResponse } from "next/server";
import { normalizeShopifyProduct, productByHandleQuery, shopifyRequest, type ShopifyProduct } from "../../../../../lib/shopify";

export async function GET(_request: Request, context: { params: Promise<{ handle: string }> }) {
  const { handle } = await context.params;
  try {
    const data = await shopifyRequest<{ product: ShopifyProduct | null }>(productByHandleQuery, { handle });
    if (!data?.product) return NextResponse.json({ product: null }, { status: 404 });
    return NextResponse.json({ product: { ...normalizeShopifyProduct(data.product), descriptionHtml: data.product.descriptionHtml, images: data.product.images.nodes } });
  } catch (error) {
    return NextResponse.json({ product: null, error: error instanceof Error ? error.message : "Shopify unavailable" }, { status: 502 });
  }
}
