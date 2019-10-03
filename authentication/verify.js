
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    //   console.log(bearerHeader);
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // console.log(req.token);
      // Next middleware
      jwt.verify(req.token, "secretkey", async (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
           next();
        }
      });
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }

  module.exports=verifyToken;