const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const verifyToken = require("../authentication/verify");
const schema = require("../validation/products");
const bodyparser = require("body-parser");
const db = require("../database/query");
const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));

async function addProducts() {
  let categories = await db.categoriesQuery();
  router.get("/", function(req, res) {
    res.render("edit", {
      categories: categories
    });
  });

  router.post("/", upload.single("upload"), (req, res, next) => {
    console.log();
    Joi.validate(req.body, schema, (err, result) => {
      if (err) {
        next(err);
      } else {
        console.log(result);
        addProduct();
        // res.send("validation Succes");
      }
    });
    async function addProduct() {
      let filename = req.file.originalname.split(".", 1)[0];
      let categoryId = await db.categoriesIdQuery(req.body.category);
      let addquery = `insert into products(category_id,name,shortname,specification,new_price,old_price) 
          values(${categoryId},'${req.body.name}','${filename}','${req.body.specification}','${req.body.newprice}','${req.body.oldprice}')`;
      let queryresult = await db.sqlQuery(addquery);
      console.log(queryresult);
      res.redirect("/products/all");
    }
  });
}

async function updateProducts() {
  let categories = await db.categoriesQuery();
  router.get("/:id", async function(req, res, next) {
    let product = await db.eachProducts(req.params.id);
    res.render("update", {
      categories: categories,
      products: product[0]
    });
  });
  router.post("/:id", upload.single("upload"), (req, res, next) => {
    Joi.validate(req.body, schema, (err, result, next) => {
      if (err) {
        next(err);
      } else {
        console.log(result);
        updateProduct();
      }
      // res.send("validation Succes");
    });
    async function updateProduct() {
      let id = req.params.id;
      let filename = req.file;
      if (filename) {
        filename = req.file.originalname.split(".", 1)[0];
      } else {
        filename = req.body.imagename;
      }
      let categoryId = await db.categoriesIdQuery(req.body.category);
      let updatequery = `update products set name="${req.body.name}",category_id=${categoryId},shortname="${filename}",
        specification="${req.body.specification}",new_price="${req.body.newprice}",old_price="${req.body.oldprice}"  
        where id=${id}`;
      let queryresult = await db.sqlQuery(updatequery);
      console.log(queryresult);
      res.redirect("/products/all");
    }
  });
}

router.delete("/:id", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let id = req.params.id;
      let deletequery = `delete from products where id=${id}`;
      let queryresult = await db.sqlQuery(deletequery);
      if (queryresult.length == 1) {
        res.send("deleted successfully");
      } else {
        res.send("Products does not exist ");
      }
    }
  });
});

module.exports = {
  router: router,
  addProducts: addProducts,
  updateProducts: updateProducts
};
