import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, inr } from '../api';

export const statusClass = (s) => 's-' + s.toLowerCase().replace(/\s+/g, '-');

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/orders/mine').then(setOrders).catch((e) => setError(e.message)); }, []);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p className="center muted">Loading…</p>;
  if (!orders.length)
    return (
      <div className="empty glass">
        <h2>No orders yet</h2>
        <Link to="/" className="btn">Browse products</Link>
      </div>
    );

  return (
    <>
      <h1 className="title">My Orders</h1>
      <div className="stack">
        {orders.map((o) => (
          <Link key={o._id} to={`/orders/${o._id}`} className="line glass">
            <div className="thumbs">{o.items.slice(0, 3).map((i, k) => <img key={k} src={i.image} alt="" />)}</div>
            <div className="grow">
              <h3>Order #{o._id.slice(-6).toUpperCase()}</h3>
              <p className="muted small">{new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {o.items.length} item(s)</p>
            </div>
            <span className={`pill ${statusClass(o.status)}`}>{o.status}</span>
            <strong className="w">{inr(o.total)}</strong>
          </Link>
        ))}
      </div>
    </>
  );
}
