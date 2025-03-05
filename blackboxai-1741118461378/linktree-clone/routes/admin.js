const express = require('express');
const router = express.Router();
const { User, Link, Setting } = require('../models');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/admin/login');
};

// Admin login page
router.get('/login', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: null });
});

// Admin login process
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (user && await user.validatePassword(password)) {
      req.session.userId = user.id;
      res.redirect('/admin/dashboard');
    } else {
      res.render('admin/login', { error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.render('admin/login', { error: 'An error occurred' });
  }
});

// Admin dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const links = await Link.findAll({ order: [['order', 'ASC']] });
    const settings = await Setting.findOne({ where: { id: 1 } });
    res.render('admin/dashboard', { links, settings });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Settings page
router.get('/settings', isAuthenticated, async (req, res) => {
  try {
    const settings = await Setting.findOne({ where: { id: 1 } });
    res.render('admin/settings', { settings });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Update settings
router.post('/settings', isAuthenticated, async (req, res) => {
  try {
    const { title, description, profileImage, backgroundColor, primaryColor } = req.body;
    const settings = await Setting.findOne({ where: { id: 1 } });
    
    if (settings) {
      await settings.update({
        title,
        description,
        profileImage,
        backgroundColor,
        primaryColor
      });
    } else {
      await Setting.create({
        title,
        description,
        profileImage,
        backgroundColor,
        primaryColor
      });
    }
    
    res.redirect('/admin/settings');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Create new link
router.post('/links', isAuthenticated, async (req, res) => {
  try {
    const { title, url, icon, image, backgroundColor, order } = req.body;
    await Link.create({ title, url, icon, image, backgroundColor, order });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get link data for editing
router.get('/links/:id', isAuthenticated, async (req, res) => {
  try {
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json(link);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Update link
router.post('/links/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, url, icon, image, backgroundColor, order } = req.body;
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).send('Link not found');
    }
    await link.update({ title, url, icon, image, backgroundColor, order });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Delete link
router.post('/links/:id/delete', isAuthenticated, async (req, res) => {
  try {
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).send('Link not found');
    }
    await link.destroy();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

module.exports = router;
