const router = require('express').Router();
const User = require('../model/User');
const verify = require('./verifyToken');
const verifyAdmin = require('./verifyTokenAdmin');

router.get('/getUsers', verifyAdmin, async (req, res) => {
    try {
      const users = await User.find({}, '-password');
      res.send(users);
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });

router.patch('/setAdmin/:userId', verifyAdmin, async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
      
      // update user
      user.account_type = 'ADMIN';
      await user.save();
  
      res.send('User is now an administrator');
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });

router.patch('/removeAdmin/:userId', verifyAdmin, async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      user.account_type = 'TEACHER';
      await user.save();
  
      res.send('Administrator role removed for the user');
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  });
  
  

module.exports = router;