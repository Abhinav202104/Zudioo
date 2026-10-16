import { Link } from 'react-router-dom';
import { inr } from '../api';

export default function ProductCard({ p }) {
  return (
    <Link to={`/product/${p._id}`} className="card glass">
      <div className="thumb">
        <img src={p.image} alt={p.name} loading="lazy" />
        {p.stock === 0 && <span className="tag">Sold out</span>}
        {p.stock > 0 && p.stock < 10 && <span className="tag warn">Only {p.stock} left</span>}
      </div>
      <div className="card-body">
        <small className="muted">{p.category}</small>
        <h3>{p.name}</h3>
        <div className="row between">
          <strong className="price">{inr(p.price)}</strong>
          <span className="rating">★ {p.rating}</span>
        </div>
      </div>
    </Link>
  );
}
