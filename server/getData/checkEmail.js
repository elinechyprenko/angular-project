const {con} = require('../db/db.config');
let express = require('express');
const app = express();

app.get('/user/email', (req,res) => {
    const email = req.query.email
    const sql = 'select * from user where email=?';
    con.query(sql, [email], (error,result) => {
        if (error) {
            console.error('Error checking email:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (result.length > 0) {
            res.json(true)
        }
        else {
            res.json(false);
        }
    })
});

module.exports = app;