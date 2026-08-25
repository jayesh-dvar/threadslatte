type ShopifyResponse<T> = { data?: T; errors?: Array<{ message: string }> };

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  images: { nodes: Array<{ url: string; altText: string | null }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: Array<{ id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string } }> };
};

const endpoint = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2025-07";
  return domain ? `https://${domain.replace(/^https?:\/\//, "")}/api/${version}/graphql.json` : null;
};

export async function shopifyRequest<T>(query: string, variables: Record<string, unknown> = {}) {
  const url = endpoint();
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!url || !token) return null;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Shopify request failed with ${response.status}`);
  const payload = await response.json() as ShopifyResponse<T>;
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join(", "));
  return payload.data ?? null;
}

export const productQuery = `#graphql
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: BEST_SELLING) {
      nodes {
        id handle title descriptionHtml productType tags availableForSale
        images(first: 8) { nodes { url altText } }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 20) { nodes { id title availableForSale price { amount currencyCode } } }
      }
    }
  }
`;

export const productByHandleQuery = `#graphql
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id handle title descriptionHtml productType tags availableForSale
      images(first: 8) { nodes { url altText } }
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 20) { nodes { id title availableForSale price { amount currencyCode } } }
    }
  }
`;

export const cartFields = `#graphql
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
  }
`;

export function normalizeShopifyProduct(product: ShopifyProduct) {
  const type = `${product.productType} ${product.tags.join(" ")} ${product.title}`.toLowerCase();
  const category = type.includes("top") || type.includes("shirt") || type.includes("shrug") ? "Tops" : type.includes("pant") || type.includes("bottom") || type.includes("skort") ? "Bottoms" : type.includes("set") || type.includes("co-ord") || type.includes("coord") ? "Co-ords" : "Dresses";
  const variant = product.variants.nodes.find((item) => item.availableForSale) ?? product.variants.nodes[0];
  return {
    name: product.title,
    category,
    price: new Intl.NumberFormat("en-IN", { style: "currency", currency: product.priceRange.minVariantPrice.currencyCode, maximumFractionDigits: 0 }).format(Number(product.priceRange.minVariantPrice.amount)),
    tag: product.availableForSale ? "Made-to-order" : "Sold out",
    image: product.images.nodes[0]?.url ?? "",
    tint: "#f4bfd0",
    variantId: variant?.id,
    handle: product.handle,
  };
}
