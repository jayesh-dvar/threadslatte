"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { catalogProducts, type CatalogProduct } from "../lib/catalog";
import { fallbackInstagramPosts, type InstagramPost } from "../lib/instagram";

type Category = "All" | "Dresses" | "Co-ords" | "Tops" | "Bottoms";
type Product = CatalogProduct;

const categories: Category[] = ["All", "Dresses", "Co-ords", "Tops", "Bottoms"];
const communityClasses = ["one", "two", "three", "four"] as const;

const gallery = [
  { name: "Dresses", copy: "For plans that deserve a little more.", image: "https://threadsandlatte.com/cdn/shop/files/dresses.jpg?v=1749188803&width=1400", className: "gallery-card gallery-card--tall" },
  { name: "Co-ords", copy: "Put together, without overthinking it.", image: "https://threadsandlatte.com/cdn/shop/files/Co-ords.jpg?v=1749188803&width=1400", className: "gallery-card gallery-card--yellow" },
  { name: "Tops", copy: "The beginning of a very good outfit.", image: "https://threadsandlatte.com/cdn/shop/files/Tops.jpg?v=1749188803&width=1400", className: "gallery-card gallery-card--pink" },
  { name: "Bottoms", copy: "Made to mix, match and move.", image: "https://threadsandlatte.com/cdn/shop/files/Bottoms.jpg?v=1749195041&width=1400", className: "gallery-card gallery-card--lilac" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [bagCount, setBagCount] = useState(() => typeof window === "undefined" ? 0 : Number(window.localStorage.getItem("tl-bag-count") ?? 0));
  const [bagItems, setBagItems] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem("tl-bag-items") ?? "[]") as string[]; } catch { return []; }
  });
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [liked, setLiked] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>(catalogProducts);
  const [shopifyLive, setShopifyLive] = useState(false);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>(fallbackInstagramPosts);
  const [instagramLive, setInstagramLive] = useState(false);
  const [cartId, setCartId] = useState(() => typeof window === "undefined" ? "" : window.localStorage.getItem("tl-cart-id") ?? "");
  const [cartUrl, setCartUrl] = useState("");
  const filteredProducts = useMemo(() => activeCategory === "All" ? catalog : catalog.filter((product) => product.category === activeCategory), [activeCategory, catalog]);

  useEffect(() => {
    fetch("/api/shopify/products")
      .then((response) => response.ok ? response.json() : null)
      .then((data: { products?: Product[] } | null) => {
        if (data?.products?.length) { setCatalog(data.products); setShopifyLive(true); }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetch("/api/instagram")
      .then((response) => response.ok ? response.json() : null)
      .then((data: { posts?: InstagramPost[]; live?: boolean } | null) => {
        if (data?.posts?.length) setInstagramPosts(data.posts);
        setInstagramLive(Boolean(data?.live));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setSearchOpen(false); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [searchOpen]);

  function selectCategory(category: Category) {
    setActiveCategory(category);
    requestAnimationFrame(() => document.getElementById("bestsellers")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function addToBag(product: Product) {
    if (!product.variantId) { setBagCount((count) => count + 1); setBagItems((items) => [...items, product.name]); return; }
    try {
      const response = await fetch("/api/shopify/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: cartId ? "add" : "create", cartId, lines: [{ merchandiseId: product.variantId, quantity: 1 }] }) });
      const data = await response.json() as { cart?: { id: string; checkoutUrl: string; totalQuantity: number } };
      if (data.cart) { setCartId(data.cart.id); setCartUrl(data.cart.checkoutUrl); setBagCount(data.cart.totalQuantity); setBagItems((items) => [...items, product.name]); window.localStorage.setItem("tl-cart-id", data.cart.id); window.localStorage.setItem("tl-cart-url", data.cart.checkoutUrl); return; }
    } catch { /* Keep preview add-to-bag usable without Shopify credentials. */ }
    setBagCount((count) => count + 1);
    setBagItems((items) => [...items, product.name]);
  }

  useEffect(() => { window.localStorage.setItem("tl-bag-count", String(bagCount)); window.localStorage.setItem("tl-bag-items", JSON.stringify(bagItems)); }, [bagCount, bagItems]);

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return term ? catalog.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(term)).slice(0, 5) : catalog.slice(0, 5);
  }, [catalog, searchTerm]);

  function subscribe(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (email.trim()) setSubscribed(true); }

  return (
    <main>
      <div className="announcement"><span>FREE SHIPPING ACROSS INDIA</span><span className="announcement-dot">✦</span><span>MADE-TO-ORDER, MADE MORE YOU</span><span className="announcement-dot">✦</span><span>COD AVAILABLE ON ORDERS UNDER ₹6,500</span></div>
      <header className="site-header">
        <Link className="wordmark" href="/#top" aria-label="Threads and Latte home"><span>THREADS</span><b>&</b><span>LATTE</span></Link>
        <nav className={menuOpen ? "main-nav main-nav--open" : "main-nav"}>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a><a href="#bestsellers" onClick={() => setMenuOpen(false)}>Bestsellers</a><Link href="/our-story" onClick={() => setMenuOpen(false)}>Our story</Link><a href="#customisation" onClick={() => setMenuOpen(false)}>Make it yours</a>
        </nav>
        <div className="header-actions"><button className="icon-button" aria-label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen(true)}>⌕</button><button className="bag-button" aria-label={`${bagCount} items in bag`} onClick={() => cartUrl ? window.location.assign(cartUrl) : setBagOpen(true)}>Bag <span>{bagCount}</span></button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? "Close" : "Menu"}</button></div>
      </header>

      {searchOpen ? <div className="search-panel-backdrop"><button type="button" className="overlay-close" aria-label="Close search" onClick={() => setSearchOpen(false)} /><section className="search-panel" role="dialog" aria-modal="true" aria-label="Search Threads and Latte"><div className="search-panel-top"><p className="eyebrow">Find your next favourite</p><button type="button" className="close-button" aria-label="Close search" onClick={() => setSearchOpen(false)}>×</button></div><input type="search" placeholder="Try ‘dress’ or ‘co-ords’" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /> <div className="search-results">{searchResults.length ? searchResults.map((product) => <a key={product.handle} href={`/products/${product.handle}`} onClick={() => setSearchOpen(false)}><span>{product.name}</span><small>{product.category} · {product.price}</small></a>) : <p>No pieces found. Try another search.</p>}</div></section></div> : null}

      <section className="hero hero--poster" id="top">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> New-season energy / India / Est. over coffee</div><h1>No boring outfits.<em>Ever.</em></h1><p>Made-to-order womenswear with personality turned all the way up—and the comfort to actually live in it.</p><div className="hero-actions"><a className="button button--dark" href="#bestsellers">Shop the collection <span>↗</span></a><a className="text-link" href="#customisation">How it works <span>→</span></a></div><div className="hero-note"><span>☕</span> Your wardrobe called. It wants a plot twist.</div></div>
        <div className="hero-art"><div className="hero-sticker">NO<br />BORING<br /><i>outfits</i></div><div className="hero-image" role="img" aria-label="Threads and Latte fashion campaign" /><div className="hero-caption"><span>01</span><span>Wear the good idea</span></div></div>
      </section>
      <div className="ticker" aria-label="Threads and Latte values"><div className="ticker-track"><span>MADE-TO-ORDER</span><b>✦</b><span>CUSTOMISABLE</span><b>✦</b><span>WOMEN-LED</span><b>✦</b><span>LOCAL ARTISANS</span><b>✦</b><span>MADE-TO-ORDER</span><b>✦</b><span>CUSTOMISABLE</span><b>✦</b><span>WOMEN-LED</span><b>✦</b><span>LOCAL ARTISANS</span></div></div>

      <section className="section products-section" id="shop"><div className="section-heading"><div><p className="eyebrow">The good stuff</p><h2>Currently in everyone&apos;s<br /><i>coffee order.</i></h2></div><p className="section-intro">Real pieces from the current T&amp;L catalogue—from playful minis and effortless co-ords to statement silhouettes made for plans worth dressing up for.</p></div><div className="filter-row" id="bestsellers"><div className="filters" role="tablist" aria-label="Filter products by category">{categories.map((category) => <button key={category} className={activeCategory === category ? "filter filter--active" : "filter"} onClick={() => selectCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div><span className="result-count">{filteredProducts.length} pieces to love · {shopifyLive ? "live Shopify catalogue" : "preview catalogue"}</span></div><div className="product-grid">{filteredProducts.map((product) => <article className="product-card" key={product.name}><div className="product-image" style={{ backgroundImage: `url(${product.image})`, backgroundColor: product.tint }}><span className="product-tag">{product.tag}</span><button className={liked.includes(product.handle) ? "heart heart--active" : "heart"} aria-label={`${liked.includes(product.handle) ? "Remove" : "Save"} ${product.name}`} aria-pressed={liked.includes(product.handle)} onClick={() => setLiked((items) => items.includes(product.handle) ? items.filter((item) => item !== product.handle) : [...items, product.handle])}>{liked.includes(product.handle) ? "♥" : "♡"}</button><button className="quick-add" onClick={() => void addToBag(product)}>Add to bag <span>+</span></button></div><div className="product-meta"><div><h3><a href={`/products/${product.handle}`}>{product.name}</a></h3><p>Made-to-order / {product.category}</p></div><strong>{product.price}</strong></div></article>)}</div><div className="center-link"><a className="button button--outline" href="#categories">Shop all pieces <span>↗</span></a></div></section>

      <section className="section categories-section" id="categories"><div className="section-heading section-heading--tight"><div><p className="eyebrow">Pick your mood</p><h2>Find your kind<br /><i>of T&L.</i></h2></div><p className="section-intro">Whether today calls for an easy co-ord, a dress that does the talking or separates you can keep styling your way, start here.</p></div><div className="gallery-grid">{gallery.map((item, index) => <a className={item.className} href="#bestsellers" key={item.name} onClick={(event) => { event.preventDefault(); selectCategory(item.name as Category); }}><div className="gallery-image" style={{ backgroundImage: `url(${item.image})` }} /><div className="gallery-overlay"><span>0{index + 1}</span><div><h3>{item.name}</h3><p>{item.copy}</p></div><b>↗</b></div></a>)}</div></section>

      <section className="custom-section" id="customisation"><div className="custom-copy"><p className="eyebrow">Personal, not complicated</p><h2>Make it yours.<br /><i>Keep it simple.</i></h2><p>A personal fit should not feel like a complicated tailoring appointment. Choose your piece, pick your size, and tell us what would make it more you.</p><div className="custom-steps"><div><span>01</span><strong>Choose your piece</strong></div><div><span>02</span><strong>Pick your size</strong></div><div><span>03</span><strong>Tell us what to tweak</strong></div></div><a className="button button--dark" href="#bestsellers">Shop customisable styles <span>↗</span></a></div><div className="custom-art"><div className="custom-image" role="img" aria-label="Editorial image of a woman in a lilac outfit" /><div className="custom-badge">SIZE · LENGTH<br />SLEEVES · MORE<br /><em>where available</em></div></div></section>

      <section className="story-teaser section" id="story"><div className="story-teaser-art"><div className="story-image" role="img" aria-label="Threads and Latte founders Juhi and Shreya" /><div className="story-image-label"><span>THE ORIGINAL T&amp;L GIRLS</span><b>↗</b></div></div><div className="story-teaser-copy"><p className="eyebrow">Juhi + Shreya / India</p><h2>Built over coffee.<br /><i>Made for you.</i></h2><p>Threads &amp; Latte is a women-led label for the many ways you dress, move and express yourself—made-to-order and made to feel like you.</p><div className="story-proof"><div><strong>01</strong><span>Women-led</span></div><div><strong>02</strong><span>Made-to-order</span></div><div><strong>03</strong><span>Local craft</span></div></div><Link className="button button--outline" href="/our-story">Meet the founders <span>↗</span></Link></div></section>
      <section className="community-section section"><div className="section-heading section-heading--tight"><div><p className="eyebrow">Out in the world</p><h2>T&L, styled<br /><i>by you.</i></h2></div><p className="section-intro">The pieces people notice. The silhouettes you keep reaching for. See how the T&L community makes each piece their own.</p></div><div className="community-grid">{instagramPosts.map((post, index) => <a className={`community-image community-image--${communityClasses[index % communityClasses.length]}`} key={post.id} href={post.href} target="_blank" rel="noreferrer" aria-label={post.alt} title={post.caption} style={{ backgroundImage: `url(${post.image})` }} />)}</div><p className="community-status">{instagramLive ? "Live from Instagram" : "A few favourite T&L moments"}</p><div className="center-link"><a className="button button--outline" href="https://www.instagram.com/threadsandlatte/" target="_blank" rel="noreferrer">Follow @threadsandlatte <span>↗</span></a></div></section>
      <section className="newsletter-section"><div className="newsletter-copy"><p className="eyebrow">The T&L memo</p><h2>Your next T&L fix,<br /><i>delivered.</i></h2><p>New drops, first looks, styling notes and occasional offers—straight to your inbox. No complicated coffee order required.</p></div><form className="newsletter-form" onSubmit={subscribe}>{subscribed ? <p className="success-message">You&apos;re on the list. See you in your inbox ✦</p> : <><label htmlFor="email">Your email address</label><div><input id="email" type="email" placeholder="you@coffeemail.com" value={email} onChange={(event) => setEmail(event.target.value)} required /><button type="submit">Join the T&L tribe <span>↗</span></button></div><small>Only the good stuff. Unsubscribe whenever you like.</small></>}</form></section>
      <footer className="site-footer" id="footer"><div className="footer-top"><a className="wordmark wordmark--footer" href="#top"><span>THREADS</span><b>&</b><span>LATTE</span></a><p>Made for your wardrobe.<br /><i>Made more personal.</i></p><div className="footer-coffee">☕</div></div><div className="footer-links"><div><h3>Shop</h3><a href="#bestsellers">All pieces</a>{(["Dresses", "Co-ords", "Tops", "Bottoms"] as Category[]).slice(1).map((category) => <a href="#bestsellers" key={category} onClick={(event) => { event.preventDefault(); selectCategory(category); }}>{category}</a>)}</div><div><h3>Made for you</h3><a href="#customisation">Customisation</a><a href="#customisation">Size & fit</a><a href="#customisation">How it works</a></div><div><h3>Our world</h3><Link href="/our-story">Our story</Link><Link href="/our-story#approach">Our approach</Link><a href="https://www.instagram.com/threadsandlatte/">Instagram</a></div><div><h3>Help</h3><a href="mailto:hello@threadsandlatte.com">Contact us</a><a href="#footer">Shipping</a><a href="#footer">Returns & refunds</a><a href="#footer">Privacy policy</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Threads & Latte</span><span>Made with good taste + better coffee</span><span>India ↗</span></div></footer>
      {bagOpen ? <div className="bag-drawer-backdrop"><button type="button" className="overlay-close" aria-label="Close bag" onClick={() => setBagOpen(false)} /><aside className="bag-drawer" role="dialog" aria-modal="true" aria-label="Your bag"><div className="bag-drawer-top"><div><p className="eyebrow">Your T&amp;L edit</p><h2>Your bag <i>({bagCount})</i></h2></div><button type="button" className="close-button" aria-label="Close bag" onClick={() => setBagOpen(false)}>×</button></div>{bagItems.length ? <div className="bag-items">{bagItems.map((item, index) => <p key={`${item}-${index}`}><span>{item}</span><small>Made-to-order</small></p>)}</div> : <p className="bag-empty">Your bag is waiting for a good idea.</p>}{cartUrl ? <a className="button button--dark" href={cartUrl}>Checkout on Shopify <span>↗</span></a> : <a className="button button--dark" href="#bestsellers" onClick={() => setBagOpen(false)}>Keep shopping <span>↗</span></a>}</aside></div> : null}
    </main>
  );
}
