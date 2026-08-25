/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getCatalogProduct } from "../../../lib/catalog";
import { normalizeShopifyProduct, productByHandleQuery, shopifyRequest, type ShopifyProduct } from "../../../lib/shopify";
import ProductActions from "./ProductActions";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const data = await shopifyRequest<{ product: ShopifyProduct | null }>(productByHandleQuery, { handle });
  const fallback = getCatalogProduct(handle);
  return { title: data?.product ? `${data.product.title} | Threads & Latte` : fallback ? `${fallback.name} | Threads & Latte` : "Product | Threads & Latte", description: fallback?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const data = await shopifyRequest<{ product: ShopifyProduct | null }>(productByHandleQuery, { handle });
  const fallback = getCatalogProduct(handle);
  if (!data?.product && !fallback) {
    return <main className="product-detail-page"><p className="eyebrow">Threads &amp; Latte / product</p><h1>That piece has<br /><em>left the edit.</em></h1><p>Try another style from the current collection, or head back to the homepage to find your next favourite.</p><Link className="button button--dark" href="/#bestsellers">Back to the collection <span>↗</span></Link></main>;
  }
  const product = data?.product ? normalizeShopifyProduct(data.product) : fallback!;
  const title = data?.product?.title ?? fallback!.name;
  const images = data?.product?.images.nodes ?? fallback!.images ?? [fallback!.image];
  const description = data?.product?.descriptionHtml || `<p>${fallback!.description ?? "Thoughtfully made, easy to wear and designed to feel like you."}</p>`;
  return <main className="product-detail-page"><header className="product-page-header"><Link className="wordmark" href="/"><span>THREADS</span><b>&amp;</b><span>LATTE</span></Link><nav><Link href="/#bestsellers">Shop</Link><Link href="/#story">Our story</Link><Link href="/#customisation">Make it yours</Link></nav><Link className="product-page-bag" href="/#bestsellers">Bag →</Link></header><Link className="back-link" href="/#bestsellers">← Back to collection</Link><div className="product-detail-grid"><div className="product-detail-gallery">{images.map((image) => <img key={typeof image === "string" ? image : image.url} src={typeof image === "string" ? image : image.url} alt={typeof image === "string" ? title : image.altText || title} />)}</div><div className="product-detail-copy"><p className="eyebrow">{product.category} / made-to-order</p><h1>{title}</h1><p className="product-detail-price">{product.price}</p><div className="product-detail-description" dangerouslySetInnerHTML={{ __html: description }} /><p className="product-detail-note">Choose your size on Shopify checkout, then add any size, length or sleeve requests in the customisation note.</p><ProductActions handle={handle} name={title} variantId={product.variantId} /><Link className="shopify-product-link" href={`https://threadsandlatte.com/products/${handle}`}>View the original Shopify product page ↗</Link></div></div></main>;
}
