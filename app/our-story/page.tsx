import Link from "next/link";

export const metadata = {
  title: "Our Story | Threads & Latte",
  description: "Meet the women-led team behind Threads & Latte and the choices that shape every made-to-order piece.",
};

export default function OurStoryPage() {
  return (
    <main>
      <div className="announcement"><span>FREE SHIPPING ACROSS INDIA</span><span className="announcement-dot">✦</span><span>MADE-TO-ORDER, MADE MORE YOU</span><span className="announcement-dot">✦</span><span>COD AVAILABLE ON ORDERS UNDER ₹6,500</span></div>
      <header className="site-header story-page-header">
        <Link className="wordmark" href="/" aria-label="Threads and Latte home"><span>THREADS</span><b>&amp;</b><span>LATTE</span></Link>
        <nav className="main-nav"><Link href="/#shop">Shop</Link><Link href="/#bestsellers">Bestsellers</Link><Link href="/our-story">Our story</Link><Link href="/#customisation">Make it yours</Link></nav>
        <Link className="product-page-bag" href="/#bestsellers">Bag →</Link>
      </header>

      <section className="story-section story-page-hero section" id="story">
        <div className="story-section-top"><span>01 / THE STORY</span><span>JUHI + SHREYA / INDIA</span></div>
        <div className="story-art"><div className="story-image" role="img" aria-label="Threads and Latte founders Juhi and Shreya" /><div className="story-image-label"><span>THE ORIGINAL T&amp;L GIRLS</span><b>↗</b></div></div>
        <div className="story-copy"><div className="story-strip" role="img" aria-label="Threads and Latte campaign details" /><p className="eyebrow">Where fashion is fuelled by laughter + filled coffee dates</p><h1>More than<br />just <em>clothes.</em></h1><p>Threads &amp; Latte began with two friends, Juhi and Shreya, a shared love for fashion and more iced-latte conversations than anyone was counting.</p><p>What started over coffee became a women-led label for the many ways women dress, move and express themselves—made-to-order, thoughtfully customised and made to feel like you.</p><div className="story-proof"><div><strong>01</strong><span>Women-led</span></div><div><strong>02</strong><span>Made-to-order</span></div><div><strong>03</strong><span>Local craft</span></div></div></div>
      </section>

      <section className="conscious-section story-page-approach section" id="approach">
        <div className="conscious-copy"><p className="eyebrow">Behind the seams</p><h2>Made with more<br /><i>intention.</i></h2><p>For us, being conscious is less about labels and more about the choices behind each piece. We make what is needed, work with skilled local artisans, and keep learning as we grow.</p><p>That means considered quantities, useful customisation and clothes designed to stay in your wardrobe beyond one season or one photograph.</p></div>
        <div className="conscious-stats"><div><strong>01</strong><p>Made after<br />you order</p></div><div><strong>02</strong><p>Local artisan<br />craftsmanship</p></div><div><strong>03</strong><p>Paper-first<br />packaging</p></div></div>
      </section>

      <section className="story-page-cta section"><p className="eyebrow">Now you know the why</p><h2>Find the piece that<br /><i>feels like you.</i></h2><Link className="button button--dark" href="/#bestsellers">Shop the collection <span>↗</span></Link></section>

      <footer className="site-footer"><div className="footer-top"><Link className="wordmark wordmark--footer" href="/"><span>THREADS</span><b>&amp;</b><span>LATTE</span></Link><p>Made for your wardrobe.<br /><i>Made more personal.</i></p><div className="footer-coffee">☕</div></div><div className="footer-links"><div><h3>Shop</h3><Link href="/#bestsellers">All pieces</Link><Link href="/#categories">Categories</Link></div><div><h3>Made for you</h3><Link href="/#customisation">Customisation</Link><Link href="/#customisation">How it works</Link></div><div><h3>Our world</h3><Link href="/our-story">Our story</Link><Link href="/our-story#approach">Our approach</Link><a href="https://www.instagram.com/threadsandlatte/">Instagram</a></div><div><h3>Help</h3><a href="mailto:hello@threadsandlatte.com">Contact us</a><Link href="/#footer">Shipping</Link><Link href="/#footer">Returns &amp; refunds</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Threads &amp; Latte</span><span>Made with good taste + better coffee</span><span>India ↗</span></div></footer>
    </main>
  );
}
