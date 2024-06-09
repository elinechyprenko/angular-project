const { con } = require('../db/db.config');
let express = require('express');
const app = express();

app.get('/products', (req, res) => {
    const getProducts = 'SELECT categories.title AS category_title, products.title AS product_title, products.description, products.price, products.image, products.info FROM products_categories JOIN categories ON categories.category_id = products_categories.category_id JOIN products ON products.product_id = products_categories.product_id';
    con.query(getProducts, (error, results, fields) => {
        if (error) {
            console.log('Data is not get')
            res.status(500).send('Data retrieval failed');
            return;
        }

        const groupedData = results.reduce((acc, curr) => {
            if (!acc[curr.category_title]) {
                acc[curr.category_title] = {
                    category_title: curr.category_title,
                    products: [],
                    productCount: 0
                };
            }
            acc[curr.category_title].products.push({
                title: curr.product_title,
                description: curr.description,
                price: curr.price,
                info: curr.info,
                image: curr.image
            });
            acc[curr.category_title].productCount++
            return acc;
        }, {});

        const responseData = Object.values(groupedData);
        res.json(responseData);
    });
});

module.exports = app