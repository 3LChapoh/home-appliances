const CATEGORIES = ['edp', 'edt', 'parfum', 'attar', 'oud', 'gift set']

function Filters({ filters, onChange, searchPlaceholder }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="controls">
      <input
        className="field search"
        placeholder={searchPlaceholder || 'Search perfume, oud, boutique…'}
        value={filters.search || ''}
        onChange={(e) => update('search', e.target.value)}
      />
      <select
        className="field"
        value={filters.category || ''}
        onChange={(e) => update('category', e.target.value)}
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        className="field"
        value={filters.vendor || ''}
        onChange={(e) => update('vendor', e.target.value)}
      >
        <option value="">All boutiques</option>
      </select>
      <select
        className="field"
        value={filters.sort || 'featured'}
        onChange={(e) => update('sort', e.target.value)}
      >
        <option value="featured">Featured</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
        <option value="name">Name A–Z</option>
      </select>
    </div>
  )
}

export default Filters
