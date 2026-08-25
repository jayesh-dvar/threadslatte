"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "All" | "Dresses" | "Co-ords" | "Tops" | "Bottoms";
type HeroOption = "poster" | "editorial" | "campaign";
type Product = { name: string; category: Exclude<Category, "All">; price: string; tag?: string; image: string; tint: string; variantId?: string; handle?: string };

const categories: Category[] = ["All", "Dresses", "Co-ords", "Tops", "Bottoms"];

const heroDirections: { id: HeroOption; label: string; eyebrow: string; title: React.ReactNode; copy: string; note: string }[] = [
  { id: "poster", label: "Poster", eyebrow: "New-season energy / India / Est. over coffee", title: <>No boring outfits.<em>Ever.</em></>, copy: "Made-to-order womenswear with personality turned all the way up—and the comfort to actually live in it.", note: "Your wardrobe called. It wants a plot twist." },
  { id: "editorial", label: "Editorial", eyebrow: "Women-led / India / Est. over coffee", title: <>Made-to-order<em>made more you.</em></>, copy: "Contemporary womenswear with a little more personality, a lot more comfort, and thoughtful customisation built in.", note: "Your wardrobe called. It wants something less predictable." },
  { id: "campaign", label: "Campaign", eyebrow: "A little loud / A lot of you / Made to order", title: <>Dress like you<em>mean it.</em></>, copy: "Pieces for the plans, the pictures and the main-character walk home—customised to feel unmistakably yours.", note: "Good clothes. Better energy. Zero outfit regret." },
];

const products: Product[] = [
  { name: "Chai & Chill Set", category: "Co-ords", price: "₹7,500", tag: "New drop", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/Untitleddesign-6.png?v=1778915404", tint: "#e7c3b6", variantId: "gid://shopify/ProductVariant/51854215905566", handle: "chai-chill-set" },
  { name: "Spill the Rosé Maxi", category: "Dresses", price: "₹10,500", tag: "New drop", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/Untitleddesign-5.png?v=1775026000", tint: "#f5b3c4", variantId: "gid://shopify/ProductVariant/50750077108510", handle: "spill-the-rose-maxi" },
  { name: "Island Escape", category: "Dresses", price: "₹8,500", tag: "Bestseller", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/IslandEscapeOlive1.jpg?v=1733406512", tint: "#c7e1d0", variantId: "gid://shopify/ProductVariant/49402804109598", handle: "island-escape-olive-green" },
  { name: "C’est La Vie Set", category: "Co-ords", price: "₹5,000", tag: "Easy yes", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/C_estLaVieSet.png?v=1759996779", tint: "#d9d0ff", variantId: "gid://shopify/ProductVariant/50219008753950", handle: "c-est-la-vie-set" },
  { name: "Ruffled Affair Mini Dress", category: "Dresses", price: "₹6,000", tag: "Made for plans", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/Untitleddesign.zip-26.png?v=1759996368", tint: "#f2d67d", variantId: "gid://shopify/ProductVariant/50218999677214", handle: "ruffled-affair-mini-dress-blue" },
  { name: "Palm Kiss Mini Dress", category: "Dresses", price: "₹2,950", tag: "Just in", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/PalmKissMiniDress.png?v=1759996311", tint: "#efc2a6", variantId: "gid://shopify/ProductVariant/50218993811742", handle: "palm-kiss-mini-dress" },
  { name: "Golden Glow Set", category: "Co-ords", price: "₹4,500", tag: "Repeat wear", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/Untitleddesign.zip-28.png?v=1759995835", tint: "#f5d878", variantId: "gid://shopify/ProductVariant/50218936893726", handle: "golden-glow-set" },
  { name: "Botanic Bliss", category: "Co-ords", price: "₹4,999", tag: "Artisan made", image: "https://cdn.shopify.com/s/files/1/0870/6899/9966/files/BotanicBlissWhite4.jpg?v=1733406177", tint: "#c9e5d4", variantId: "gid://shopify/ProductVariant/49402805813534", handle: "botanic-bliss-white" },
];

const gallery = [
  { name: "Dresses", copy: "For plans that deserve a little more.", image: "https://threadsandlatte.com/cdn/shop/files/dresses.jpg?v=1749188803&width=1400", className: "gallery-card gallery-card--tall" },
  { name: "Co-ords", copy: "Put together, without overthinking it.", image: "https://threadsandlatte.com/cdn/shop/files/Co-ords.jpg?v=1749188803&width=1400", className: "gallery-card gallery-card--yellow" },
  { name: "Tops", copy: "The beginning of a very good outfit.", image: "https://threadsandlatte.com/cdn/shop/files/Tops.jpg?v=1749188803&width=1400", className: "gallery-card gallery-card--pink" },
  { name: "Bottoms", copy: "Made to mix, match and move.", image: "https://threadsandlatte.com/cdn/shop/files/Bottoms.jpg?v=1749195041&width=1400", className: "gallery-card gallery-card--lilac" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [bagCount, setBagCount] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [shopifyLive, setShopifyLive] = useState(false);
  const [heroOption, setHeroOption] = useState<HeroOption>("poster");
  const [cartId, setCartId] = useState(() => typeof window === "undefined" ? "" : window.localStorage.getItem("tl-cart-id") ?? "");
  const [cartUrl, setCartUrl] = useState("");
  const filteredProducts = useMemo(() => activeCategory === "All" ? catalog : catalog.filter((product) => product.category === activeCategory), [activeCategory, catalog]);
  const heroDirection = heroDirections.find((direction) => direction.id === heroOption) ?? heroDirections[0];

  useEffect(() => {
    fetch("/api/shopify/products")
      .then((response) => response.ok ? response.json() : null)
      .then((data: { products?: Product[] } | null) => {
        if (data?.products?.length) { setCatalog(data.products); setShopifyLive(true); }
      })
      .catch(() => undefined);
  }, []);

  async function addToBag(product: Product) {
    if (!product.variantId) { setBagCount((count) => count + 1); return; }
    try {
      const response = await fetch("/api/shopify/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: cartId ? "add" : "create", cartId, lines: [{ merchandiseId: product.variantId, quantity: 1 }] }) });
      const data = await response.json() as { cart?: { id: string; checkoutUrl: string; totalQuantity: number } };
      if (data.cart) { setCartId(data.cart.id); setCartUrl(data.cart.checkoutUrl); setBagCount(data.cart.totalQuantity); window.localStorage.setItem("tl-cart-id", data.cart.id); return; }
    } catch { /* Keep preview add-to-bag usable without Shopify credentials. */ }
    setBagCount((count) => count + 1);
  }

  function subscribe(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (email.trim()) setSubscribed(true); }

  return (
    <main>
      <div className="announcement"><span>FREE SHIPPING ACROSS INDIA</span><span className="announcement-dot">✦</span><span>MADE-TO-ORDER, MADE MORE YOU</span><span className="announcement-dot">✦</span><span>COD AVAILABLE ON ORDERS UNDER ₹6,500</span></div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Threads and Latte home"><span>THREADS</span><b>&</b><span>LATTE</span></a>
        <nav className={menuOpen ? "main-nav main-nav--open" : "main-nav"}>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a><a href="#bestsellers" onClick={() => setMenuOpen(false)}>Bestsellers</a><a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><a href="#customisation" onClick={() => setMenuOpen(false)}>Make it yours</a>
        </nav>
        <div className="header-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="bag-button" aria-label={`${bagCount} items in bag`} onClick={() => cartUrl ? window.location.assign(cartUrl) : document.getElementById("bestsellers")?.scrollIntoView({ behavior: "smooth" })}>Bag <span>{bagCount}</span></button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? "Close" : "Menu"}</button></div>
      </header>

      <section className={`hero hero--${heroOption}`} id="top">
        <div className="hero-direction-switcher" role="tablist" aria-label="Compare hero directions">
          <span>Try the hero in</span>
          {heroDirections.map((direction, index) => <button key={direction.id} className={heroOption === direction.id ? "hero-direction hero-direction--active" : "hero-direction"} onClick={() => setHeroOption(direction.id)} role="tab" aria-selected={heroOption === direction.id}><b>0{index + 1}</b>{direction.label}</button>)}
        </div>
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> {heroDirection.eyebrow}</div><h1>{heroDirection.title}</h1><p>{heroDirection.copy}</p><div className="hero-actions"><a className="button button--dark" href="#bestsellers">Shop the collection <span>↗</span></a><a className="text-link" href="#customisation">How it works <span>→</span></a></div><div className="hero-note"><span>☕</span> {heroDirection.note}</div></div>
        <div className="hero-art"><div className="hero-sticker">{heroOption === "poster" ? <>NO<br />BORING<br /><i>outfits</i></> : heroOption === "campaign" ? <>MAIN<br />CHARACTER<br /><i>energy</i></> : <>DESIGNED<br />TO FEEL<br /><i>like you</i></>}</div><div className="hero-image" role="img" aria-label="Threads and Latte fashion campaign" /><div className="hero-caption"><span>01</span><span>{heroOption === "poster" ? "Wear the good idea" : heroOption === "campaign" ? "Made for plans worth dressing up for" : "Live catalogue / made after you order"}</span></div></div>
      </section>
      <div className="ticker" aria-label="Threads and Latte values"><div className="ticker-track"><span>MADE-TO-ORDER</span><b>✦</b><span>CUSTOMISABLE</span><b>✦</b><span>WOMEN-LED</span><b>✦</b><span>LOCAL ARTISANS</span><b>✦</b><span>MADE-TO-ORDER</span><b>✦</b><span>CUSTOMISABLE</span><b>✦</b><span>WOMEN-LED</span><b>✦</b><span>LOCAL ARTISANS</span></div></div>

      <section className="section products-section" id="bestsellers"><div className="section-heading"><div><p className="eyebrow">The good stuff</p><h2>Currently in everyone&apos;s<br /><i>coffee order.</i></h2></div><p className="section-intro">Real pieces from the current T&amp;L catalogue—from playful minis and effortless co-ords to statement silhouettes made for plans worth dressing up for.</p></div><div className="filter-row" id="shop"><div className="filters" role="tablist" aria-label="Filter products by category">{categories.map((category) => <button key={category} className={activeCategory === category ? "filter filter--active" : "filter"} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div><span className="result-count">{filteredProducts.length} pieces to love · {shopifyLive ? "live Shopify catalogue" : "preview catalogue"}</span></div><div className="product-grid">{filteredProducts.map((product) => <article className="product-card" key={product.name}><div className="product-image" style={{ backgroundImage: `url(${product.image})`, backgroundColor: product.tint }}><span className="product-tag">{product.tag}</span><button className="heart" aria-label={`Save ${product.name}`}>♡</button><button className="quick-add" onClick={() => void addToBag(product)}>Add to bag <span>+</span></button></div><div className="product-meta"><div><h3>{product.handle ? <a href={`/products/${product.handle}`}>{product.name}</a> : product.name}</h3><p>Made-to-order / {product.category}</p></div><strong>{product.price}</strong></div></article>)}</div><div className="center-link"><a className="button button--outline" href="#categories">Shop all pieces <span>↗</span></a></div></section>

      <section className="section categories-section" id="categories"><div className="section-heading section-heading--tight"><div><p className="eyebrow">Pick your mood</p><h2>Find your kind<br /><i>of T&L.</i></h2></div><p className="section-intro">Whether today calls for an easy co-ord, a dress that does the talking or separates you can keep styling your way, start here.</p></div><div className="gallery-grid">{gallery.map((item, index) => <a className={item.className} href="#bestsellers" key={item.name}><div className="gallery-image" style={{ backgroundImage: `url(${item.image})` }} /><div className="gallery-overlay"><span>0{index + 1}</span><div><h3>{item.name}</h3><p>{item.copy}</p></div><b>↗</b></div></a>)}</div></section>

      <section className="custom-section" id="customisation"><div className="custom-copy"><p className="eyebrow">Personal, not complicated</p><h2>Make it yours.<br /><i>Keep it simple.</i></h2><p>A personal fit should not feel like a complicated tailoring appointment. Choose your piece, pick your size, and tell us what would make it more you.</p><div className="custom-steps"><div><span>01</span><strong>Choose your piece</strong></div><div><span>02</span><strong>Pick your size</strong></div><div><span>03</span><strong>Tell us what to tweak</strong></div></div><a className="button button--dark" href="#bestsellers">Shop customisable styles <span>↗</span></a></div><div className="custom-art"><div className="custom-image" role="img" aria-label="Editorial image of a woman in a lilac outfit" /><div className="custom-badge">SIZE · LENGTH<br />SLEEVES · MORE<br /><em>where available</em></div></div></section>

      <section className="story-section section" id="story"><div className="story-section-top"><span>01 / THE STORY</span><span>JUHI + SHREYA / INDIA</span></div><div className="story-art"><div className="story-image" role="img" aria-label="Threads and Latte founders Juhi and Shreya" /><div className="story-image-label"><span>THE ORIGINAL T&amp;L GIRLS</span><b>↗</b></div></div><div className="story-copy"><div className="story-strip" role="img" aria-label="Threads and Latte campaign details" /><p className="eyebrow">Where fashion is fuelled by laughter + filled coffee dates</p><h2>More than<br />just <i>clothes.</i></h2><p>Threads &amp; Latte began with two friends, Juhi and Shreya, a shared love for fashion and more iced-latte conversations than anyone was counting.</p><p>What started over coffee became a women-led label for the many ways women dress, move and express themselves—made-to-order, thoughtfully customised and made to feel like you.</p><div className="story-proof"><div><strong>01</strong><span>Women-led</span></div><div><strong>02</strong><span>Made-to-order</span></div><div><strong>03</strong><span>Local craft</span></div></div><a className="text-link" href="#footer">Our story <span>→</span></a></div></section>
      <section className="conscious-section section"><div className="conscious-copy"><p className="eyebrow">Behind the seams</p><h2>Made with more<br /><i>intention.</i></h2><p>For us, being conscious is less about labels and more about the choices behind each piece. We make what is needed, work with skilled local artisans, and keep learning as we grow.</p><a className="text-link" href="#footer">Discover how we make <span>→</span></a></div><div className="conscious-stats"><div><strong>01</strong><p>Made after<br />you order</p></div><div><strong>02</strong><p>Local artisan<br />craftsmanship</p></div><div><strong>03</strong><p>Paper-first<br />packaging</p></div></div></section>
      <section className="community-section section"><div className="section-heading section-heading--tight"><div><p className="eyebrow">Out in the world</p><h2>T&L, styled<br /><i>by you.</i></h2></div><p className="section-intro">The pieces people notice. The silhouettes you keep reaching for. See how the T&L community makes each piece their own.</p></div><div className="community-grid"><div className="community-image community-image--one" /><div className="community-image community-image--two" /><div className="community-image community-image--three" /><div className="community-image community-image--four" /></div><div className="center-link"><a className="button button--outline" href="https://www.instagram.com/threadsandlatte/">Follow @threadsandlatte <span>↗</span></a></div></section>
      <section className="newsletter-section"><div className="newsletter-copy"><p className="eyebrow">The T&L memo</p><h2>Your next T&L fix,<br /><i>delivered.</i></h2><p>New drops, first looks, styling notes and occasional offers—straight to your inbox. No complicated coffee order required.</p></div><form className="newsletter-form" onSubmit={subscribe}>{subscribed ? <p className="success-message">You&apos;re on the list. See you in your inbox ✦</p> : <><label htmlFor="email">Your email address</label><div><input id="email" type="email" placeholder="you@coffeemail.com" value={email} onChange={(event) => setEmail(event.target.value)} required /><button type="submit">Join the T&L tribe <span>↗</span></button></div><small>Only the good stuff. Unsubscribe whenever you like.</small></>}</form></section>
      <footer className="site-footer" id="footer"><div className="footer-top"><a className="wordmark wordmark--footer" href="#top"><span>THREADS</span><b>&</b><span>LATTE</span></a><p>Made for your wardrobe.<br /><i>Made more personal.</i></p><div className="footer-coffee">☕</div></div><div className="footer-links"><div><h3>Shop</h3><a href="#bestsellers">All pieces</a><a href="#categories">Dresses</a><a href="#categories">Co-ords</a><a href="#categories">Tops</a><a href="#categories">Bottoms</a></div><div><h3>Made for you</h3><a href="#customisation">Customisation</a><a href="#customisation">Size & fit</a><a href="#customisation">How it works</a></div><div><h3>Our world</h3><a href="#story">Our story</a><a href="#footer">Our approach</a><a href="https://www.instagram.com/threadsandlatte/">Instagram</a></div><div><h3>Help</h3><a href="mailto:hello@threadsandlatte.com">Contact us</a><a href="#footer">Shipping</a><a href="#footer">Returns & refunds</a><a href="#footer">Privacy policy</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Threads & Latte</span><span>Made with good taste + better coffee</span><span>India ↗</span></div></footer>
    </main>
  );
}
