const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
const payload = (u) => ({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin, token: sign(u._id) });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already registered' });
    res.status(201).json(payload(await User.create({ name, email, password })));
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (!user || !(await user.matchPassword(req.body.password || '')))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json(payload(user));
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;
