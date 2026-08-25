/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { normalizeShopifyProduct, productByHandleQuery, shopifyRequest, type ShopifyProduct } from "../../../lib/shopify";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const data = await shopifyRequest<{ product: ShopifyProduct | null }>(productByHandleQuery, { handle });
  return { title: data?.product ? `${data.product.title} | Threads & Latte` : "Product | Threads & Latte" };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const data = await shopifyRequest<{ product: ShopifyProduct | null }>(productByHandleQuery, { handle });
  if (!data?.product) {
    return <main className="product-detail-page"><p className="eyebrow">Shopify product page</p><h1>Connect the catalogue<br /><em>to view this piece.</em></h1><p>Once the Storefront API variables are present, this route reads the product, variants, imagery, customisation fields and live checkout state from Shopify.</p><Link className="button button--dark" href="/#bestsellers">Back to the collection <span>↗</span></Link></main>;
  }
  const product = normalizeShopifyProduct(data.product);
  return <main className="product-detail-page"><Link className="back-link" href="/#bestsellers">← Back to collection</Link><div className="product-detail-grid"><div className="product-detail-gallery">{data.product.images.nodes.map((image) => <img key={image.url} src={image.url} alt={image.altText || data.product?.title || "Threads & Latte product"} />)}</div><div className="product-detail-copy"><p className="eyebrow">{product.category} / made-to-order</p><h1>{data.product.title}</h1><p className="product-detail-price">{product.price}</p><div className="product-detail-description" dangerouslySetInnerHTML={{ __html: data.product.descriptionHtml }} /><p className="product-detail-note">Choose your size on Shopify checkout, then add any size, length or sleeve requests in the customisation note.</p><Link className="button button--dark" href={`https://threadsandlatte.com/products/${handle}`}>Shop this piece on Shopify <span>↗</span></Link></div></div></main>;
}
