require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const img = (s) => `https://picsum.photos/seed/${s}/700/700`;
const products = [
  ['Noir Wireless Headphones', 'Studio-grade over-ear headphones with 40-hour battery, adaptive noise cancelling and a velvet-matte finish.', 12999, 'Audio', 'noir-hp', 25, 4.8],
  ['Vinyl Turntable Deck', 'Belt-drive turntable with walnut plinth and built-in preamp for a warm analogue sound.', 18499, 'Audio', 'vinyl', 12, 4.7],
  ['Aurora Smartwatch', 'AMOLED display, ECG, GPS and 7-day battery in a brushed titanium case.', 15999, 'Wearables', 'aurora-sw', 30, 4.6],
  ['Cinema Mirrorless Camera', '26MP full-frame sensor, 6K video and 5-axis stabilisation for filmmakers on the move.', 94999, 'Cameras', 'cinecam', 8, 4.9],
  ['Anamorphic Lens 50mm', 'Cinematic oval bokeh and signature blue flares. Manual focus, all-metal build.', 32999, 'Cameras', 'anamorph', 10, 4.7],
  ['Ember Leather Jacket', 'Full-grain leather biker jacket with quilted lining. Ages beautifully.', 21999, 'Fashion', 'ember-jkt', 15, 4.5],
  ['Obsidian Chronograph', 'Sapphire crystal, Japanese automatic movement and a matte black dial.', 27499, 'Wearables', 'obsidian', 9, 4.8],
  ['Velvet Desk Lamp', 'Warm-dim LED lamp with touch dimmer, ideal for late-night edits.', 3499, 'Home', 'vlamp', 50, 4.4],
  ['Mechanical Keyboard — Onyx', 'Hot-swappable 75% board with gasket mount, PBT keycaps and RGB underglow.', 8999, 'Gadgets', 'onyx-kb', 40, 4.7],
  ['Portable Projector Pro', '1080p LED projector, 120" throw, built-in speakers. Movie night anywhere.', 19999, 'Gadgets', 'proj', 14, 4.5],
  ['Suede Chelsea Boots', 'Hand-stitched suede boots with cushioned insoles and a durable crepe sole.', 6999, 'Fashion', 'chelsea', 35, 4.3],
  ['Smart Ambient Light Strip', '10m addressable RGB strip, syncs to music and your screen.', 2499, 'Home', 'strip', 80, 4.2],
].map(([name, description, price, category, s, stock, rating]) => ({ name, description, price, category, image: img(s), stock, rating }));

(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://abhinavmishrajee2021_db_user:sws8Yk3d8naXXjRa@cluster0.0eznrjn.mongodb.net/');
  await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany()]);
  await User.create({ name: 'Admin', email: 'admin@cinestore.com', password: 'admin123', isAdmin: true });
  await Product.insertMany(products);
  console.log('Seeded: 1 admin, ' + products.length + ' products');
  process.exit(0);
})();
