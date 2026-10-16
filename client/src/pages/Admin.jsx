import { useEffect, useState } from 'react';
import { api, inr } from '../api';
import { statusClass } from './Orders';

const STEPS = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { api('/orders').then(setOrders).catch((e) => setError(e.message)); }, []);

  const update = async (id, status) => {
    try {
      const upd = await api(`/orders/${id}/status`, { method: 'PUT', body: { status } });
      setOrders((cur) => cur.map((o) => (o._id === id ? { ...o, status: upd.status } : o)));
    } catch (e) { setError(e.message); }
  };

  return (
    <>
      <h1 className="title">Admin · Orders</h1>
      {error && <p className="error">{error}</p>}
      <div className="glass table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6).toUpperCase()}<br /><small className="muted">{new Date(o.createdAt).toLocaleDateString('en-IN')}</small></td>
                <td>{o.user?.name}<br /><small className="muted">{o.user?.email}</small></td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td>{inr(o.total)}</td>
                <td>
                  <select className={`pill-select ${statusClass(o.status)}`} value={o.status} onChange={(e) => update(o._id, e.target.value)}>
                    {STEPS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan="5" className="center muted">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
