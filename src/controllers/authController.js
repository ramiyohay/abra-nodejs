const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!email || !password) return res.status(400).json({ message: 'email/password required' });
  
  const exists = await User.findOne({ where: { email }});
  
  if (exists) return res.status(400).json({ message: 'email exists' });
  
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  
  res.json({ id: user.id, email: user.email });
};

// user login, returns token
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email }});
  
  if (!user) return res.status(401).json({ message: 'invalid user' });
  
  const ok = await bcrypt.compare(password, user.password);
  
  if (!ok) return res.status(401).json({ message: 'invalid password' });
  
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
  
  res.json({ token });
};
