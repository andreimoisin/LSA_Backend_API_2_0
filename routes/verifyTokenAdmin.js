const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;

    // check if user is ADMIN
    if (req.user.account_type !== 'ADMIN') {
      return res.status(403).send('Access Denied, no admin! ==> ' + req.user.account_type);
    }

    next();
  } catch (err) {
    res.status(403).send('Invalid Token');
  }
};
