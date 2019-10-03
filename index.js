const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const jwt = require("jsonwebtoken");
const hbs = require("express-handlebars");
const bodyparser = require("body-parser");
const auth = require("./authentication/index.js");
const verifyToken = require("./authentication/verify");
const products = require("./routes/products");
const category = require("./routes/category");
app.use("/", auth);
app.use("/products", products.router);
app.use("/categories", category);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.redirect("/categories/all/products");
});

app.post("/verify", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      products.addProducts();
      products.updateProducts();
      res.redirect("/products");
    }
  });
});

app.use(express.static("images/"));
app.set("views", path.join(__dirname, "views"));
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts"
  })
);
app.set("view engine", "hbs");

app.listen(port, function() {
  console.log(`Server running in port ${port}.....`);
});
