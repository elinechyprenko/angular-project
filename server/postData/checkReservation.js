const { con } = require('../db/db.config');
let express = require('express');
const app = express();


app.post('/checkReservation', (req, res) => {
    const { email } = req.body;
    const sql = 'SELECT email, status FROM booking JOIN tables ON booking.table_id = tables.table_id WHERE booking.email = ? AND tables.status = "ok"  AND tables.date >= CURDATE();';
    con.query(sql, [email], (error, results) => {
        if (error) {
            console.error('Error checking reservation:', error);
            return res.status(500).json({ error: 'Error checking reservation' });
        }
        if (results.length > 0) {
            return res.json({ reservationExists: true });
        } else {
            return res.json({ reservationExists: false });
        }
    })
})

module.exports = app;