const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// Place order — prices & stock are re-validated server-side (never trust client prices)
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, shipping, paymentMethod } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'Cart is empty' });
    if (!shipping?.name || !shipping?.address || !shipping?.city || !shipping?.pincode || !shipping?.phone)
      return res.status(400).json({ message: 'Complete shipping details are required' });

    const orderItems = [];
    let total = 0;
    for (const it of items) {
      const qty = Math.max(1, parseInt(it.qty) || 1);
      const p = await Product.findById(it.product).catch(() => null);
      if (!p) return res.status(404).json({ message: 'A product in your cart no longer exists' });
      if (p.stock < qty) return res.status(400).json({ message: `Only ${p.stock} left of "${p.name}"` });
      orderItems.push({ product: p._id, name: p.name, price: p.price, image: p.image, qty });
      total += p.price * qty;
    }
    for (const it of orderItems) await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });

    const order = await Order.create({
      user: req.user._id, items: orderItems, shipping,
      paymentMethod: paymentMethod || 'COD', total,
      timeline: [{ status: 'Placed' }],
    });
    res.status(201).json(order);
  } catch (e) { next(e); }
});

router.get('/mine', protect, async (req, res, next) => {
  try { res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.get('/', protect, admin, async (req, res, next) => {
  try { res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'Order not found' });
    if (String(o.user) !== String(req.user._id) && !req.user.isAdmin)
      return res.status(403).json({ message: 'Not your order' });
    res.json(o);
  } catch { res.status(404).json({ message: 'Order not found' }); }
});

router.put('/:id/status', protect, admin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!Order.STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'Order not found' });
    o.status = status;
    o.timeline.push({ status });
    await o.save();
    res.json(o);
  } catch (e) { next(e); }
});

module.exports = router;
