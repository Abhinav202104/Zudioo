import { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('new');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      api(`/products?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&sort=${sort}`)
        .then((d) => { setProducts(d.products); setCategories(d.categories); setError(''); })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [q, category, sort]);

  return (
    <>
      <section className="hero glass">
        <p className="eyebrow">Season 01 · Now Showing</p>
        <h1>Gear worthy of<br /><em>the final cut.</em></h1>
        <p className="muted">Premium audio, cameras and lifestyle pieces — curated with a cinematic eye.</p>
        <a href="#shop" className="btn">Explore the collection</a>
      </section>

      <section id="shop">
        <div className="toolbar glass">
          <input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">Newest</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        <div className="chips">
          {['All', ...categories].map((c) => (
            <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {error && <p className="error">{error} </p>}
        {loading ? <p className="center muted">Loading…</p> : products.length === 0 ? (
          <p className="center muted">No products found.</p>
        ) : (
          <div className="grid">{products.map((p) => <ProductCard key={p._id} p={p} />)}</div>
        )}
      </section>
    </>
  );
}
