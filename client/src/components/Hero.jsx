const HERO_SEEDS = ['3PDQa7TLBaQ', 'QkC2gICf0zc', 'gHnPWtW2NlE', '_ju6ZXbNKvY', 'MyzZWb87HuM']
const uimg = (id, w = 600, h = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`

export default function Hero({ stats }) {
  return (
    <section className="hero" id="home">
      <div className="hero-layer far" />
      <div className="hero-collage">
        {HERO_SEEDS.map((seed, i) => (
          <div className={`hero-slot ${['fx1', 'fx2', 'fx3'][i % 3]}`} key={seed} style={{ animationDelay: `${-i * 3.4}s` }}>
            <img src={uimg(seed)} alt="Fine fragrance" loading="lazy" />
          </div>
        ))}
      </div>
      <div className="hero-layer near" />
      <div className="hero-copy">
        <div className="eyebrow">Nairobi's house of fine fragrance</div>
        <h1>
          Wear something <em>unforgettable.</em>
        </h1>
        <p>
          A considered marketplace of fine perfume, rare attars and beautiful scent rituals from
          independent Nairobi boutiques.
        </p>
        <div className="cta">
          <button className="goldbtn" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore the Collection
          </button>
          <a className="ghostbtn" href="#partner">
            Become a Boutique Partner
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <strong>{stats.boutiques}</strong>
            <span>Boutiques</span>
          </div>
          <div className="stat">
            <strong>{stats.fragrances}</strong>
            <span>Fragrances</span>
          </div>
          <div className="stat">
            <strong>4.9/5</strong>
            <span>Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
