const router = require('express').Router();
const User = require('../model/User');
const UserStats = require('../model/UserStats');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation, resetPassValidation } = require('../validation');



//REGISTER
router.post('/register', async (req, res) => {

    //Validation
    const { error } = registerValidation(req.body);
    if (error)
        return res.status(422).send(error.details[0].message);

    //Check if useres exists (duplicate emails)
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist)
        return res.status(422).send('Email already exists');

    //Pass hashing
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        account_type: req.body.account_type,
        birth: req.body.birth,
        gender: req.body.gender
    });
    // try {
    //     const savedUser = await user.save();
    //     res.send({ user: user._id });
    // } catch (err) {
    //     res.status(400).send(err);
    // }
    
    try {
        const savedUser = await user.save();
    
        // Create UserStats with default values
        const userStats = new UserStats({
          user: savedUser._id
        });
        const savedUserStats = await userStats.save();
    
        res.send({ user: savedUser._id, userStats: savedUserStats._id });
      } catch (err) {
        res.status(400).send(err);
      }

});

//LOGIN
router.post('/login', async (req, res) => {

    //Validation
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(422).send(error.details[0].message);

    //Check if user exists
    const user = await User.findOne({ email: req.body.email })
    if (!user)
        return res.status(401).send('Email does not exists!');

    //Pass verify
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(401).send('Password is incorrect!');

    //Create auth token
    //const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    const token = jwt.sign({ _id: user._id, account_type: user.account_type }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send(token);


    //res.send('Logged in!');

});

//RESET PASSWORD
router.patch('/reset-password', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
        return res.status(404).send("User not found");
    }

    // Validate input
    const { error } = resetPassValidation(req.body);
    if (error) {
        return res.status(422).send(error.details[0].message);
    }

    // Check if old password is correct
    const validPass = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!validPass) {
        return res.status(401).send("Incorrect old password");
    }

    // Verify that password and repassword match
    if (req.body.password !== req.body.repassword) {
        return res.status(422).send("Password and confirmed password don't match");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Update password
    user.password = hashPassword;
    await user.save();

    res.send("Password reset successful");

});

module.exports = router;