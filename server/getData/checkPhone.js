const {con} = require('../db/db.config');
let express = require('express');
const app = express();

app.get('/user/phone', (req,res) => {
    const phone = req.query.phone;
    const sql = 'select * from user where phone=?';
    con.query(sql, [phone], (error,result) => {
        if (error) {
        console.error('Error checking phone:', error);
        res.status(500).send('Internal Server Error');
        return;
        };
        if (result.length > 0) {
            res.json(true) 
        }
        else {
            res.json(false);
        }
    })
})
module.exports = app;