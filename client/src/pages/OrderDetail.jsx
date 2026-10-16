import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api, inr } from '../api';

const STEPS = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const [o, setO] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = () => api('/orders/' + id).then(setO).catch((e) => setError(e.message));
    load();
    const t = setInterval(load, 15000); // live tracking refresh
    return () => clearInterval(t);
  }, [id]);

  if (error) return <p className="error center">{error}</p>;
  if (!o) return <p className="center muted">Loading…</p>;
  const idx = STEPS.indexOf(o.status);
  const when = (s) => o.timeline.find((t) => t.status === s)?.at;

  return (
    <>
      {state?.placed && <div className="banner glass">🎬 Order placed successfully! Thank you for shopping with us.</div>}
      <Link to="/orders" className="muted back">← All orders</Link>
      <h1 className="title">Order #{o._id.slice(-6).toUpperCase()}</h1>

      <div className="glass pad tracker">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i <= idx ? 'done' : ''} ${i === idx ? 'current' : ''}`}>
            <div className="dot">{i <= idx ? '✓' : i + 1}</div>
            <b>{s}</b>
            <small className="muted">{when(s) ? new Date(when(s)).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</small>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="stack">
          {o.items.map((i, k) => (
            <div key={k} className="line glass">
              <img src={i.image} alt={i.name} />
              <div className="grow"><h3>{i.name}</h3><p className="muted small">{inr(i.price)} × {i.qty}</p></div>
              <strong>{inr(i.price * i.qty)}</strong>
            </div>
          ))}
        </div>
        <aside className="summary glass">
          <h3>Delivery to</h3>
          <p>{o.shipping.name}<br />{o.shipping.address}<br />{o.shipping.city} – {o.shipping.pincode}<br />📞 {o.shipping.phone}</p>
          <hr />
          <div className="row between"><span className="muted">Payment</span><span>{o.paymentMethod}</span></div>
          <div className="row between big-row"><span>Total</span><strong>{inr(o.total)}</strong></div>
        </aside>
      </div>
    </>
  );
}
