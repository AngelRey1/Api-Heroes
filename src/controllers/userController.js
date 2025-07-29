import User from '../models/userModel.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualiza el fondo visual del usuario
 */
export const updateBackground = async (req, res) => {
  try {
    const { background } = req.body;
    if (!background) return res.status(400).json({ error: 'Fondo requerido' });
    req.user.background = background;
    await req.user.save();
    res.json({ message: 'Fondo actualizado', background });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 