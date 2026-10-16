import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, inr } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const nav = useNavigate();
  const [s, setS] = useState({ name: user.name, phone: '', address: '', city: '', pincode: '' });
  const [payment, setPayment] = useState('COD');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!items.length && !busy) return <Navigate to="/cart" replace />;
  const set = (k) => (e) => setS({ ...s, [k]: e.target.value });

  const place = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: { items: items.map((i) => ({ product: i._id, qty: i.qty })), shipping: s, paymentMethod: payment },
      });
      nav('/orders/' + order._id, { state: { placed: true } });
      clear();
    } catch (err) { setError(err.message); setBusy(false); }
  };

  return (
    <>
      <h1 className="title">Checkout</h1>
      <form className="two-col" onSubmit={place}>
        <div className="glass pad stack">
          <h3>Shipping details</h3>
          <input placeholder="Full name" value={s.name} onChange={set('name')} required />
          <input placeholder="Phone number (10 digits)" value={s.phone} onChange={set('phone')} required pattern="[0-9]{10}" title="10-digit phone number" />
          <textarea placeholder="Street address" value={s.address} onChange={set('address')} required rows={3} />
          <div className="row gap">
            <input placeholder="City" value={s.city} onChange={set('city')} required />
            <input placeholder="Pincode" value={s.pincode} onChange={set('pincode')} required pattern="[0-9]{6}" title="6-digit pincode" />
          </div>
          <h3>Payment</h3>
          <div className="row gap wrap">
            {['COD', 'UPI', 'Card'].map((m) => (
              <label key={m} className={`radio ${payment === m ? 'active' : ''}`}>
                <input type="radio" name="pay" checked={payment === m} onChange={() => setPayment(m)} />
                {m === 'COD' ? 'Cash on Delivery' : m}
              </label>
            ))}
          </div>
          <p className="muted small">Payment gateway is simulated in this demo.</p>
        </div>

        <aside className="summary glass">
          <h3>Your items</h3>
          {items.map((i) => (
            <div key={i._id} className="row between small"><span>{i.name} × {i.qty}</span><span>{inr(i.price * i.qty)}</span></div>
          ))}
          <hr />
          <div className="row between big-row"><span>Total</span><strong>{inr(total)}</strong></div>
          {error && <p className="error">{error}</p>}
          <button className="btn full" disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
        </aside>
      </form>
    </>
  );
}
