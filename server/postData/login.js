const { con } = require('../db/db.config');
let express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'select * from user where email=?';
    con.query(sql, [email], (error, results) => {
        if (error) {
            console.log('Errors: ', error)
        }
        else {
            if (results.length === 0) {
                res.status(404).send('User not found');
                // res.json(false)
            }
            else {
                const user = results[0];
                bcrypt.compare(password, user.password, (error, result) => {
                    if (error) {
                        console.log('Hello Error: ', error)
                    }
                    else {
                        if (result) {
                            console.log('Login successful')
                            res.json({ success: true, userData: user })
                        }
                        else {
                            console.log('Incorrect password')
                            res.json(false);
                        }
                    }
                })
            }
        }
    })
});

module.exports = app;