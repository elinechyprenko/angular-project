const {con} = require('../db/db.config');
let express = require('express');
const app = express();
const bcrypt = require('bcrypt')

const saltRound = 10;

app.post('/user', (req,res) => {
    const userData = req.body;
    const sql = 'INSERT INTO user (email,fullname,phone,birthday,password) VALUES (?,?,?,?,?)';
    const data = [userData.email, userData.fullName, userData.phone, userData.birthday, userData.password];

    bcrypt.genSalt(saltRound).then((salt) => {
        console.log('Salt: ', salt);
        return bcrypt.hash(userData.password, salt)
    })
    .then ((hash) => {
        data[4] = hash;
        con.query(sql ,data, (error, result) => {
            if (error) {
                console.error('Error saving user data to database', error);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('User data saved to database');
            }
        })
    })
    .catch(error => console.log(error));
});

module.exports = app;