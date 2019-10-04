const express = require("express");
const router = express.Router();
const verifyToken = require("../authentication/verify");
const validation = require("../validation/category");
const bodyparser = require("body-parser");
const db = require("../database/query");
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));

router.get(`/:name/products`, async function(req, res, next) {
  let categories = await db.categoriesQuery();
  let result = await db.categoriesNameQuery(req.params.name);
  if (result.length == 0) {
    next(createError(404, "Url not found"));
  } else {
    if (req.params.name == "all") {
      let products = await db.productsQueryAll();
      res.setHeader("Content-Type", "text/html");
      res.render("cast", {
        products: products,
        categories: categories
      });
      // res.json({
      //   products: products,
      //   categories: categories
      // });
    } else {
      for (let i = 1; i < categories.length; i++) {
        if (req.params.name == categories[i].name) {
          let products = await db.productsQuery(i + 1);
          res.setHeader("Content-Type", "text/html");
          res.render("cast", {
            products: products,
            categories: categories
          });
        }
      }
    }
  }
});

router.post("/", verifyToken, validation, async (req, res, next) => {
  let query = await db.categoriesNameQuery(req.body.name);
  if (query.length == 1) {
    next(createError(400, "Category already exists"));
  } else {
    try {
      let queryresult = await db.addCategory(req.body.name);
      res.status(201).json({
        data: {
          id: queryresult.insertId,
          name: req.body.name
        },
        message: "Category added"
      });
    } catch (err) {
      next(createError(500, "Database error"));
    }
  }
});
router.put("/:id", verifyToken, validation, async (req, res, next) => {
  let idquery = await db.categoriesId(req.params.id);
  if (idquery.length == 1) {
    let query = await db.categoriesNameQuery(req.body.name);
    if (query.length == 1) {
      next(createError(400, "Category name already exists can't be updated"));
    } else {
      try {
        await db.updateCategory(req.body.name, req.params.id);
        res.json({
          data: {
            id: req.params.id,
            name: req.body.name
          },
          message: "Category updated"
        });
      } catch (err) {
        next(createError(500, "Database error"));
      }
    }
  } else {
    next(createError(400, "Id doesn't exists"));
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  let id = req.params.id;
  let query = await db.categoriesId(id);
  let idquery = await db.categoriesId(req.params.id);
  if (idquery.length == 1) {
    try {
      let queryresult = await db.deleteCategory(id);
      res.status(204).json({
        data: query,
        message: "Deleted Successfully"
      });
    } catch (err) {
      next(createError(500, "Database error"));
    }
  } else {
    next(createError(400, "Category doesn't exists"));
  }
});

function createError(status, errmessage) {
  router.use((req, res) => {
    res.status(status).send(errmessage);
  });
}
module.exports = router;
