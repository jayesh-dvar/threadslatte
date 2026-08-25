import { NextResponse } from "next/server";
import { cartFields, shopifyRequest } from "../../../../lib/shopify";

type Line = { merchandiseId: string; quantity: number };

const cartCreate = `#graphql
  ${cartFields}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

const cartLinesAdd = `#graphql
  ${cartFields}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
`;

export async function POST(request: Request) {
  const body = await request.json() as { action?: "create" | "add"; cartId?: string; lines?: Line[] };
  if (!body.lines?.length) return NextResponse.json({ error: "At least one cart line is required." }, { status: 400 });
  try {
    const data = body.action === "add" && body.cartId
      ? await shopifyRequest<{ cartLinesAdd: { cart: { id: string; checkoutUrl: string; totalQuantity: number } | null; userErrors: Array<{ message: string }> } }>(cartLinesAdd, { cartId: body.cartId, lines: body.lines })
      : await shopifyRequest<{ cartCreate: { cart: { id: string; checkoutUrl: string; totalQuantity: number } | null; userErrors: Array<{ message: string }> } }>(cartCreate, { lines: body.lines });
    const result = data?.cartLinesAdd ?? data?.cartCreate;
    if (!result?.cart) return NextResponse.json({ error: result?.userErrors?.map((item) => item.message).join(", ") || "Shopify cart unavailable." }, { status: 502 });
    return NextResponse.json({ cart: result.cart });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Shopify cart unavailable" }, { status: 502 });
  }
}
