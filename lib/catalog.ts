export type CatalogCategory = "Dresses" | "Co-ords" | "Tops" | "Bottoms";

export type CatalogProduct = {
  name: string;
  category: CatalogCategory;
  price: string;
  tag?: string;
  image: string;
  images?: string[];
  tint: string;
  variantId?: string;
  handle: string;
  description?: string;
};

export const catalogProducts: CatalogProduct[] = [
  { name: "Chai & Chill Set", category: "Co-ords", price: "₹7,500", tag: "New drop", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/Untitleddesign-6.png?v=1778915404", tint: "#e7c3b6", variantId: "gid://shopify/ProductVariant/51854215905566", handle: "chai-chill-set", description: "A made-to-order set for slow mornings, long lunches and every plan in between." },
  { name: "Spill the Rosé Maxi", category: "Dresses", price: "₹10,500", tag: "New drop", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/Untitleddesign-5.png?v=1775026000", tint: "#f5b3c4", variantId: "gid://shopify/ProductVariant/50750077108510", handle: "spill-the-rose-maxi", description: "An easy, statement-making maxi with room to move and a little extra main-character energy." },
  { name: "Island Escape", category: "Dresses", price: "₹8,500", tag: "Bestseller", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/IslandEscapeOlive1.jpg?v=1733406512", tint: "#c7e1d0", variantId: "gid://shopify/ProductVariant/49402804109598", handle: "island-escape-olive-green", description: "A breezy silhouette designed for holidays, city heat and plans that start with ‘one drink’." },
  { name: "C’est La Vie Set", category: "Co-ords", price: "₹5,000", tag: "Easy yes", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/C_estLaVieSet.png?v=1759996779", tint: "#d9d0ff", variantId: "gid://shopify/ProductVariant/50219008753950", handle: "c-est-la-vie-set", description: "The polished two-piece that does the outfit thinking for you." },
  { name: "Ruffled Affair Mini Dress", category: "Dresses", price: "₹6,000", tag: "Made for plans", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/Untitleddesign.zip-26.png?v=1759996368", tint: "#f2d67d", variantId: "gid://shopify/ProductVariant/50218999677214", handle: "ruffled-affair-mini-dress-blue", description: "A playful mini with movement, ruffles and just enough drama." },
  { name: "Palm Kiss Mini Dress", category: "Dresses", price: "₹2,950", tag: "Just in", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/PalmKissMiniDress.png?v=1759996311", tint: "#efc2a6", variantId: "gid://shopify/ProductVariant/50218993811742", handle: "palm-kiss-mini-dress", description: "Your throw-on-and-go mini for sunny days and spontaneous plans." },
  { name: "Golden Glow Set", category: "Co-ords", price: "₹4,500", tag: "Repeat wear", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/Untitleddesign.zip-28.png?v=1759995835", tint: "#f5d878", variantId: "gid://shopify/ProductVariant/50218936893726", handle: "golden-glow-set", description: "A golden set made to be worn together, separately and on repeat." },
  { name: "Botanic Bliss", category: "Co-ords", price: "₹4,999", tag: "Artisan made", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/BotanicBlissWhite4.jpg?v=1733406177", tint: "#c9e5d4", variantId: "gid://shopify/ProductVariant/49402805813534", handle: "botanic-bliss-white", description: "A fresh, easy set celebrating print, craft and everyday movement." },
];

export function getCatalogProduct(handle: string) {
  return catalogProducts.find((product) => product.handle === handle);
}
