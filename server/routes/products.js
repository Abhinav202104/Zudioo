const router = require('express').Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res, next) => {
  try {
    const { q, category, sort } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: escape(q), $options: 'i' };
    if (category && category !== 'All') filter.category = category;
    const sorts = { low: { price: 1 }, high: { price: -1 }, rating: { rating: -1 }, new: { createdAt: -1 } };
    const products = await Product.find(filter).sort(sorts[sort] || { createdAt: -1 });
    const categories = await Product.distinct('category');
    res.json({ products, categories });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (e) { res.status(404).json({ message: 'Product not found' }); }
});

router.post('/', protect, admin, async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (e) { next(e); }
});
router.put('/:id', protect, admin, async (req, res, next) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (e) { next(e); }
});
router.delete('/:id', protect, admin, async (req, res, next) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
});

module.exports = router;
