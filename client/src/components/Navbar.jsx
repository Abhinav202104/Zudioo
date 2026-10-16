import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();

  return (
    <header className="nav glass">
      <Link to="/" className="logo">Cine<span>Store</span></Link>
      <nav>
        <NavLink to="/" end>Shop</NavLink>
        {user && <NavLink to="/orders">My Orders</NavLink>}
        {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
        <NavLink to="/cart">Cart{count > 0 && <b className="badge">{count}</b>}</NavLink>
        {user ? (
          <>
            <span className="hello">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn ghost sm" onClick={() => { logout(); nav('/'); }}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="btn sm">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
