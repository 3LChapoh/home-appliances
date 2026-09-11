function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-layer far" />
      <div className="hero-layer near" />
      <div className="hero-copy">
        <div className="eyebrow">Nairobi's house of fine fragrance</div>
        <h1>
          Wear something <em>unforgettable.</em>
        </h1>
        <p>
          A considered marketplace of fine perfume, rare attars and beautiful scent
          rituals from independent Nairobi boutiques.
        </p>
        <div className="cta">
          <button className="goldbtn">Explore the Collection</button>
          <button className="ghostbtn">Become a Boutique Partner</button>
        </div>
      </div>
    </section>
  )
}

export default Hero
