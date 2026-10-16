export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';
export async function api(path, { method = 'GET', body } = {}) {
  const user = JSON.parse(localStorage.getItem('cs_user') || 'null');
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
