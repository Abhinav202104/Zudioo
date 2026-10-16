import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { inr } from '../api';

export default function Cart() {
  const { items, setQty, remove, total } = useCart();
  const nav = useNavigate();

  if (!items.length)
    return (
      <div className="empty glass">
        <h2>Your cart is empty</h2>
        <p className="muted">Looks like the scene hasn't started yet.</p>
        <Link to="/" className="btn">Start shopping</Link>
      </div>
    );

  return (
    <>
      <h1 className="title">Your Cart</h1>
      <div className="two-col">
        <div className="stack">
          {items.map((i) => (
            <div key={i._id} className="line glass">
              <img src={i.image} alt={i.name} />
              <div className="grow">
                <Link to={`/product/${i._id}`}><h3>{i.name}</h3></Link>
                <p className="price">{inr(i.price)}</p>
              </div>
              <div className="qty">
                <button onClick={() => setQty(i._id, i.qty - 1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => setQty(i._id, i.qty + 1)}>+</button>
              </div>
              <strong className="w">{inr(i.price * i.qty)}</strong>
              <button className="icon" onClick={() => remove(i._id)} aria-label="Remove">✕</button>
            </div>
          ))}
        </div>
        <aside className="summary glass">
          <h3>Order Summary</h3>
          <div className="row between"><span className="muted">Subtotal</span><span>{inr(total)}</span></div>
          <div className="row between"><span className="muted">Shipping</span><span className="ok">Free</span></div>
          <hr />
          <div className="row between big-row"><span>Total</span><strong>{inr(total)}</strong></div>
          <button className="btn full" onClick={() => nav('/checkout')}>Proceed to checkout</button>
        </aside>
      </div>
    </>
  );
}
