const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db=require('../database/query');
const router = express.Router();
const saltRound=10;
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register',async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if(await db.checkExistingUser(email)==1){
        res.send("User Already exist");
    }
    else{
    let hashPwd = await hashPassword(password);
    let query = `insert into users(username,email,password) values("${username}","${email}","${hashPwd}");`;
    let queryResult = await db.sqlQuery(query);
    res.send(queryResult);
    }
});

router.post('/login', async (req, res) => {
    user = {
        name: `${req.body.username}`,
        email: `${req.body.email}`,
        password: `${req.body.password}`
      };
    let query = `select * from users where username="${user.name}";`;
      let queryResult = await db.sqlQuery(query);
      let hashResult = await compareHash(user.password,queryResult[0].password);
      if (hashResult == true) {
        jwt.sign({ user }, 'secretkey', (err, token) => {
          res.json({
            token
          });
        });
      } else {
        res.json({
          message: 'Authentication Failed'
        });
      }
    });

function hashPassword(data) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRound, function(err, salt) {
        bcrypt.hash(data, salt, function(err, hash) {
          resolve(hash);
        });
      });
    });
  }


  function compareHash(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function(err, res) {
        if (err) reject(err);
        else {
          resolve(res);
          console.log(res);
        }
      });
    });
  }

module.exports=router;

