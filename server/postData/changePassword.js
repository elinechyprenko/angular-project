const { con } = require('../db/db.config');
let express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.post('/change-password', (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    const checkEmailSQL = 'select * from user where email=?';

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).send({ success: false, message: 'Invalid request' });
    }
    con.query(checkEmailSQL, [email], (emailError, emailResult) => {
        if (emailError) {
            return res.status(500).send({ success: false, message: 'Server error' });
        }

        if (emailResult.length === 0) {
            return res.status(404).send({ success: false, message: 'User not found' });
        };
        const storedPassword = emailResult[0].password;
        bcrypt.compare(currentPassword, storedPassword, (err, isMatch) => {
            if (err) {
                return res.status(500).send({ success: false, message: 'Server error' });
            }
            if (!isMatch) {
                return res.status(401).send({ success: false, message: 'Current password is incorrect' });
            }
            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) throw err;
                const updateQuery = 'UPDATE user SET password = ? WHERE email = ?';
                con.query(updateQuery, [hash, email], (err, results) => {
                    if (err) throw err;
                    res.send({ success: true, message: 'Password changed successfully' });
                });
            });
        })
    })
});

module.exports = app;