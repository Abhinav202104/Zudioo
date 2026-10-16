import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, inr } from '../api';
import { useCart } from '../context/CartContext';

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api('/products/' + id).then(setP).catch((e) => setError(e.message)); }, [id]);

  if (error) return <p className="error center">{error}</p>;
  if (!p) return <p className="center muted">Loading…</p>;

  const addToCart = () => { add(p, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); };

  return (
    <>
      <Link to="/" className="muted back">← Back to shop</Link>
      <div className="detail glass">
        <div className="detail-img"><img src={p.image} alt={p.name} /></div>
        <div className="detail-info">
          <small className="eyebrow">{p.category}</small>
          <h1>{p.name}</h1>
          <p className="rating">★ {p.rating} <span className="muted">· Verified reviews</span></p>
          <p className="muted desc">{p.description}</p>
          <h2 className="price big">{inr(p.price)}</h2>
          <p className={p.stock > 0 ? 'ok' : 'error'}>{p.stock > 0 ? `In stock (${p.stock} available)` : 'Out of stock'}</p>

          {p.stock > 0 && (
            <div className="row gap">
              <div className="qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(p.stock, qty + 1))}>+</button>
              </div>
              <button className="btn" onClick={addToCart}>{added ? 'Added ✓' : 'Add to cart'}</button>
              <button className="btn ghost" onClick={() => { add(p, qty); nav('/cart'); }}>Buy now</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
