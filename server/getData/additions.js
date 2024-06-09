const {con} = require('../db/db.config');
let express = require('express');
const app = express();

app.get('/additions', (req, res) => {
    const getAdditions = 'SELECT products.title AS product_title, additions.title AS addition_title, additions.price AS addition_price, additions.addition_id as addition_id FROM products_additions JOIN products ON products.product_id = products_additions.product_id JOIN additions ON additions.addition_id = products_additions.addition_id';
    con.query(getAdditions, (error, results) => {
        if (error) {
            console.log('Additions are not get');
            res.status(500).send('Data retrieval failed');
            return;

        }
        const additions = results.reduce((acc, curr) => {
            if (!acc[curr.addition_title]) {
                acc[curr.addition_title] = {
                    addition_id: curr.addition_id,
                    addition_title: curr.addition_title,
                    addition_price: curr.addition_price,
                    quantity: curr.quantity,
                    products: []
                }
            };
            acc[curr.addition_title].products.push({
                title: curr.product_title
            });
            return acc;
        }, {});
        const additionData = Object.values(additions);
        res.json(additionData);
    })
});

module.exports = app;