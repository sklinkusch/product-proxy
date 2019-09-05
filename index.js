require('isomorphic-fetch');
require('now-env');

const { parse } = require('url');
const { send } = require('micro');

module.exports = async (req, res) => {
  const { query } = parse(req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  const requestUrl = `http://world.openfoodfacts.org/api/v0/product/${query}.json`;
  fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
      const {
        code,
        product: {
          code: pcode,
          brands = '',
          categories = [],
          product_name = '',
          quantity = '',
        },
        status,
        status_verbose,
      } = data;
      const catArray = categories.split(',').map(category => category.trim());
      const newData = {
        code,
        product: {
          code: pcode,
          brands,
          categories: catArray,
          product_name,
          quantity,
        },
        status,
        status_verbose,
      };
      send(res, 200, newData);
    })
    .catch(error => {
      send(res, 500, error);
    });
};
