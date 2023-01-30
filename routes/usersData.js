const router = require('express').Router();
const User = require('../model/User');
const verify = require('./verifyToken');

router.get('/name', verify, (req, res) => {
    //res.send(req.user);
    User.findOne({_id: req.user._id})
        .then(user => {
            if (!user) {
                res.status(404).send("User not found");
            } else {
                res.send(user.name);
            }
        })
        .catch(err => {
            res.status(500).send("Error: " + err);
        });
});

router.get('/', verify, (req, res) => {
    User.findOne({_id: req.user._id})
        .then(user => {
            if (!user) {
                res.status(404).send("User not found");
            } else {
                res.send(user);
            }
        })
        .catch(err => {
            res.status(500).send("Error: " + err);
        });
})

router.patch('/update', verify, async (req, res) => {
    User.findOne({_id: req.user._id})
        .then(user => {
            if (!user) {
                return res.status(404).send("User not found");
            } 

            // Update user data if it is transmitted in the request
            if (req.body.name) user.name = req.body.name;
            if (req.body.email) user.email = req.body.email;
            if (req.body.birth) user.birth = req.body.birth;
            if (req.body.gender) user.gender = req.body.gender;

            // Save the updated user to the database
            user.save()
                .then(updatedUser => {
                    res.send(updatedUser);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
        })
        .catch(err => {
            res.status(500).send("Error: " + err);
        });
});


module.exports = router;