const router = require('express').Router();
const User = require('../model/User');
const UserStats = require('../model/UserStats');
const verify = require('./verifyToken');

router.patch('/update', verify, async (req, res) => {
    UserStats.findOne({ user: req.user._id })
      .then(userStats => {
        if (!userStats) {
          return res.status(404).send("UserStats not found for user " + req.user._id);
        }
  
        // Update user stats data if it is transmitted in the request
        if (req.body.general) userStats.general = req.body.general;
        if (req.body.level1) userStats.level1 = req.body.level1;
        if (req.body.level2) userStats.level2 = req.body.level2;
        if (req.body.level3) userStats.level3 = req.body.level3;
  
        // Save the updated user stats to the database
        userStats.save()
          .then(updatedUserStats => {
            res.send(updatedUserStats);
          })
          .catch(err => {
            res.status(400).send(err);
          });
      })
      .catch(err => {
        res.status(500).send("Error: " + err);
      });
  });

  router.patch('/reset', verify, async (req, res) => {
    UserStats.findOne({ user: req.user._id })
      .then(userStats => {
        if (!userStats) {
          return res.status(404).send("UserStats not found");
        }
  
        // Reset user stats to default values
        userStats.general = {
          inapp_time: 0,
          last_accessed_date: Date.now(),
          levels_completed: 0,
          teacher_assigned: "None"
        };
        userStats.level1 = {
          level_time: 0,
          attempts: 0,
          avg_mistakes: 0
        };
        userStats.level2 = {
          level_time: 0,
          attempts: 0,
          avg_mistakes: 0
        };
        userStats.level3 = {
          level_time: 0,
          attempts: 0,
          avg_mistakes: 0
        };
  
        // Save the updated user stats to the database
        userStats.save()
          .then(updatedUserStats => {
            res.send(updatedUserStats);
          })
          .catch(err => {
            res.status(400).send(err);
          });
      })
      .catch(err => {
        res.status(500).send("Error: " + err);
      });
  });
  
  router.post('/add/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const existingStats = await UserStats.findOne({ user: user._id });
      if (existingStats) {
        return res.status(422).send('User stats already exist');
      }
  
      const userStats = new UserStats({
        user: user._id
      });
  
      const savedUserStats = await userStats.save();
      res.send(savedUserStats);
    } catch (err) {
      res.status(500).send('Error: ' + err);
    }
  });
  
  
  module.exports = router;