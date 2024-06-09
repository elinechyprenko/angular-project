const { con } = require('../db/db.config');
let express = require('express');
const app = express();

app.post('/order', (req, res) => {
    const { order_method, fullName, email, phone, date, time, address, postcode, total_price, selectedPayment, cartItems } = req.body;
    
    const sqlOrder = 'INSERT INTO `order` (order_method, full_name, email, phone, date, time, address, postcode, total_price, selected_payment) VALUES (?,?,?,?,?,?,?,?,?,?)';
    con.query(sqlOrder, [order_method, fullName, email, phone, date, time, address, postcode, total_price, selectedPayment], (error, result) => {
        if (error) {
            console.error('Error inserting order:', error);
            return res.status(500).json({ error: 'Error inserting order' });
        } else {
            const orderId = result.insertId;
            const sqlOrderItems = 'INSERT INTO order_items (order_id, product_title, price, quantity) VALUES ?';
            const orderItems = cartItems.map(item => [orderId, item.product_title, item.price, item.quantityProduct]);
            
            con.query(sqlOrderItems, [orderItems], (error, result) => {
                if (error) {
                    console.error('Error inserting order items:', error);
                    return res.status(500).json({ error: 'Error inserting order items' });
                } else {
                    console.log('Order and items saved successfully');
                    res.status(201).json({ message: 'Order and items saved successfully' });
                }
            });
        }
    });
});

module.exports = app;
