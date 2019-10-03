const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const verifyToken = require("../authentication/verify");
const schema = require("../validation/category");
const bodyparser = require("body-parser");
const db = require("../database/query");
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));

router.get(`/:endpoint/products`, async function(req, res, next) {
  let categories = await db.categoriesQuery();
  let result = await db.categoriesNameQuery(req.params.endpoint);
  if (result.length == 0) {
    next(createError(404, "Url not found"));
  } else {
    if (req.params.endpoint == "all") {
      let products = await db.productsQueryAll();
      res.render("cast", {
        products: products,
        categories: categories
      });
    } else {
      for (let i = 1; i < categories.length; i++) {
        if (req.params.endpoint == categories[i].name) {
          let products = await db.productsQuery(i + 1);
          res.render("cast", {
            products: products,
            categories: categories
          });
        }
      }
    }
  }
});

router.post("/", verifyToken, (req, res, next) => {
  Joi.validate(req.body, schema, (err, result) => {
    if (err) {
      next(err);
    } else {
      console.log(result);
      addCategory();
      // res.send("validation Succes");
    }
  });
  async function addCategory() {
    let query = await db.categoriesNameQuery(req.body.name);
    if (query.length == 1) {
      res.status(400).send({ message: "Category already exists" });
    } else {
      let addquery = `insert into categories(name) values('${req.body.name}')`;
      let queryresult = await db.sqlQuery(addquery);
      console.log(queryresult);
      res.json({
        data: {
          id: queryresult.insertId,
          name: req.body.name
        },
        message: "Category added"
      });
    }
  }
});
router.put("/:id", verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let query = await db.categoriesId(req.params.id);
      if (query.length == 1) {
        Joi.validate(req.body, schema, (err, result) => {
          if (err) {
            next(err);
          } else {
            console.log(result);
            updateCategory();
          }
        });
      }
      else{
        res.status(400).send({message:"Id doesn't exists"})
      }
      async function updateCategory() {
        let addquery = `update categories set name='${req.body.name}' where id=${req.params.id}`;
        let queryresult = await db.sqlQuery(addquery);
        if (queryresult.length) {
          res.send("Updated Succesfully");
        } else {
          res.status(500).send("Bad request");
        }
      }
    }
  });
});

router.delete("/:id", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let id = req.params.id;
      let deletequery = `delete from categories where id=${id}`;
      let queryresult = await db.sqlQuery(deletequery);
      if (queryresult.length == 1) {
        res.send("deleted successfully");
      } else {
        res.send("category does not exist ");
      }
    }
  });
});

module.exports = router;
