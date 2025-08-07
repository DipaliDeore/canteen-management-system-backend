const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  const { name, email, mob_no, password } = req.body;
  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser({
      name,
      email,
      mob_no,
      password: hashedPassword,
      is_google_login: false,
      google_id: null,
    });

    const token = generateToken(userId, 'student');
    res.status(201).json({message:'User has been registered Successfully', user_id: userId, role: 'student', token });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await adminModel.findAdminByEmail(email);
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid admin credentials' });

      const token = generateToken(admin.admin_id, 'admin');
      return res.json({ user_id: admin.admin_id, role: 'admin', token });
    }

    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid student credentials' });

    const token = generateToken(user.user_id, 'student');
    res.json({ message:'Login Successfully',user_id: user.user_id, role: 'student', token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};

exports.googleLogin = async (req, res) => {
  const { name, email, google_id } = req.body;
  try {
    let user = await userModel.findUserByGoogleId(google_id);
    if (!user) {
      const userId = await userModel.createUser({
        name,
        email,
        mob_no: '',
        password: '',
        google_id,
        is_google_login: true,
      });

      const token = generateToken(userId, 'student');
      return res.status(201).json({ user_id: userId, role: 'student', token });
    }

    const token = generateToken(user.user_id, 'student');
    res.json({ user_id: user.user_id, role: 'student', token });
  } catch (err) {
    res.status(500).json({ message: 'Google login failed', error: err });
  }
};
