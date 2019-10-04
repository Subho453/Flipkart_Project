const mysql = require("mysql");
require("dotenv").config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
connection.connect();

function sqlQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, function(err, result, fields) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function checkExistingUser(useremail) {
  return new Promise((resolve, reject) => {
    connection.query(
      `select email from users where email="${useremail}"`,
      function(err, result, fields) {
        if (err) reject(err);
        else resolve(result.length);
      }
    );
  });
}
function productsQuery(id) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM products where category_id=${id}`, function(
      err,
      result,
      fields
    ) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function eachProducts(id) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM products where id=${id}`, function(
      err,
      result,
      fields
    ) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function productsQueryAll() {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM products`, function(err, result, fields) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function categoriesQuery() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM categories", function(err, result, fields) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function categoriesIdQuery(categoryName) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id FROM categories where name="${categoryName}"`,
      function(err, result, fields) {
        if (err) reject(err);
        else resolve(result[0].id);
      }
    );
  });
}
function categoriesNameQuery(categoryName) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id FROM categories where name="${categoryName}"`,
      function(err, result, fields) {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}
function categoriesId(categoryId) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM categories where id=${categoryId}`,
      function(err, result, fields) {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}

async function addCategory(name) {
  let addquery = `insert into categories(name) values('${name}')`;
  let queryresult = await sqlQuery(addquery);
  return queryresult;
}

async function updateCategory(name, id) {
  let query = `update categories set name='${name}' where id=${id}`;
  let queryresult = await sqlQuery(query);
  return queryresult;
}

async function deleteCategory(id) {
  let deletequery = `delete from categories where id=${id}`;
  let queryresult = await sqlQuery(deletequery);
  return queryresult;
}

module.exports = {
  sqlQuery,
  checkExistingUser,
  productsQuery,
  productsQueryAll,
  eachProducts,
  categoriesIdQuery,
  categoriesQuery,
  categoriesNameQuery,
  categoriesId,
  addCategory,
  updateCategory,
  deleteCategory
};
