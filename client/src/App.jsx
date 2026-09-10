import { useEffect, useRef } from 'react'

const LEGACY_MARKUP = `
<a class="skip-link" href="#main">Skip to content</a>
<header class="nav"><div class="wrap nav-inner">
<a class="logo" href="#home">Ruby's <span>Choice</span></a>
<nav class="navlinks" aria-label="Primary"><a href="#collection">Collection</a><a href="#categories">Categories</a><a href="#partner" data-open-apply>Partner</a><a href="#orders">Orders</a></nav>
<div class="nav-actions"><button class="iconbtn" id="topHomeBtn" aria-label="Back to home" style="display:none">⌂</button><button class="iconbtn" id="themeBtn" title="Toggle theme" aria-label="Toggle light or dark theme">☼</button><button class="iconbtn" id="accountBtn" aria-label="Account and sign in">♙</button><button class="iconbtn" id="cartBtn" aria-label="Open shopping bag">🛍 <span class="cart-count" id="cartCount" aria-live="polite">0</span></button></div>
</div></header>

<main id="main">
<div id="landingView">
<section class="hero" id="home">
<div class="hero-layer far" id="far"></div>
<div class="hero-collage" id="collage"></div>
<div class="hero-layer near"></div>
<div class="hero-copy">
<div class="eyebrow">Nairobi's house of fine fragrance</div>
<h1>Wear something <em>unforgettable.</em></h1>
<p>A considered marketplace of fine perfume, rare attars and beautiful scent rituals from independent Nairobi boutiques.</p>
<div class="cta"><button class="goldbtn" id="exploreBtn">Explore the Collection</button><button class="ghostbtn" id="partnerBtn">Become a Boutique Partner</button></div>
<div class="hero-stats"><div class="stat"><strong>18</strong><span>Boutiques</span></div><div class="stat"><strong>126</strong><span>Fragrances</span></div><div class="stat"><strong>4.9/5</strong><span>Rating</span></div></div>
</div></section>

<section id="categories" class="wrap reveal">
<div class="section-head"><div><div class="eyebrow">Browse by mood</div><h2>The fragrance edit</h2></div><span class="muted" style="font-size:11px">Swipe to explore →</span></div>
<div class="cat-track" id="catTrack"></div>
</section>

<section id="collection" class="wrap reveal">
<div class="section-head"><div><div class="eyebrow">Curated in Nairobi</div><h2>The collection</h2></div><span class="muted" id="resultCount" style="font-size:11px"></span></div>
<div class="controls">
<input class="field search" id="search" placeholder="Search perfume, oud, boutique…">
<select class="field" id="categoryFilter"><option value="">All categories</option></select>
<select class="field" id="vendorFilter"><option value="">All boutiques</option></select>
<select class="field" id="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name A–Z</option></select>
</div>
<div class="products" id="products"></div>
<div class="view-more-wrap" id="landingMore"><button class="goldbtn" id="viewMoreBtn">View All Products</button></div>
</section>

<section id="partner" class="wrap reveal">
<div style="border:1px solid var(--line);border-radius:14px;padding:25px;background:linear-gradient(135deg,#c9a24b0d,#1f6f540d)">
<div class="eyebrow">For independent boutiques</div><h2 class="serif" style="font-size:38px;margin:6px 0 10px">Open your house on Ruby's Choice.</h2>
<p class="muted" style="max-width:650px;font-size:13px">Bring your catalogue to discerning customers across Nairobi. Apply once, wait for approval, then activate your boutique with a one-time PIN.</p>
<button class="goldbtn" id="applyBtn">Apply to become a boutique</button>
</div></section>

<section id="orders" class="wrap reveal">
<div class="section-head"><div><div class="eyebrow">Your account</div><h2>Orders</h2></div></div>
<div id="orderSummary" class="notice">No orders yet. Your completed purchases will appear here.</div>
</section>
</div>

<div id="productsView" style="display:none">
<section id="all-products" class="wrap all-products-page">
<button class="ghostbtn" id="backToHomeBtn" style="margin-bottom:20px">← Home</button>
<div class="section-head"><div><div class="eyebrow">The complete edit</div><h2>All products</h2><p class="muted" style="font-size:12px;margin:5px 0 0">Explore the full Ruby's Choice catalogue.</p></div><span class="muted" id="allResultCount" style="font-size:11px"></span></div>
<div class="controls">
<input class="field search" id="allSearch" placeholder="Search the full collection…">
<select class="field" id="allCategoryFilter"><option value="">All categories</option></select>
<select class="field" id="allVendorFilter"><option value="">All boutiques</option></select>
<select class="field" id="allSort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name A–Z</option></select>
</div>
<div class="page-size-row"><span class="muted">Products per page</span><div class="page-sizes" id="pageSizes"><button class="page-size active" data-size="8">8</button><button class="page-size" data-size="16">16</button><button class="page-size" data-size="24">24</button><button class="page-size" data-size="32">32</button></div></div>
<div class="products" id="allProducts"></div>
<div class="pagination" id="pagination"></div>
</section>
</div>
</main>

<footer class="footer"><div class="wrap"><div class="footer-grid"><div><h3>Ruby's Choice</h3><p>Nairobi's house of fine fragrance — bringing independent perfume boutiques together under one considered roof.</p></div><div><b style="font-size:11px">Explore</b><p><a href="#collection">Collection</a><br><a href="#categories">Categories</a><br><a href="#orders">Orders</a></p></div><div><b style="font-size:11px">Boutiques</b><p><a href="#partner" data-open-apply>Become a partner</a><br>Vendor support<br>Nairobi, Kenya</p></div></div><div class="copy">©<br>Boniface | Omae<br>2026 Ruby's Choice <br> Crafted for scent lovers in Nairobi</div></div></footer>

<nav class="bottom-nav" id="bottomNav" aria-label="Quick access">
<button id="bnTheme" style="--d:.03s" aria-label="Toggle light or dark theme">☼</button>
<button id="bnShop" style="--d:.08s" aria-label="Shop all products">⊞</button>
<button id="bnAccount" style="--d:.13s" aria-label="Account and sign in">♙</button>
<button id="bnFav" style="--d:.18s" aria-label="View favourites">♥<span class="cart-count" id="favCountBottom" aria-live="polite">0</span></button>
<button id="bnCart" style="--d:.23s" aria-label="Open shopping bag">🛍<span class="cart-count" id="cartCountBottom" aria-live="polite">0</span></button>
</nav>

<button class="back-to-top" id="backToTop" aria-label="Back to top">
<svg viewBox="0 0 52 52"><circle class="btt-track" cx="26" cy="26" r="22"></circle><circle class="btt-progress" id="bttProgress" cx="26" cy="26" r="22" stroke-dasharray="138.2" stroke-dashoffset="138.2"></circle></svg>
<span class="btt-arrow">↑</span>
</button>

<div class="overlay" id="overlay"><div class="drawer" id="drawer"></div></div>
<div class="toast" id="toast"></div>

`

function App() {
  const injectedRef = useRef(false)

  useEffect(() => {
    if (injectedRef.current) return
    injectedRef.current = true

    const script = document.createElement('script')
    script.src = '/legacy-app.js'
    script.async = false
    document.body.appendChild(script)

    return () => {
      // Left in place on unmount: the legacy script's init() attaches
      // listeners directly to DOM nodes that unmount with this component,
      // so removing the <script> tag here wouldn't clean much up anyway.
    }
  }, [])

  return (
    <div id="app-root" dangerouslySetInnerHTML={{ __html: LEGACY_MARKUP }} />
  )
}

export default App
