const {con} = require('../db/db.config');
let express = require('express');
const app = express();

app.get('/get-reservation-tables' , (req,res) => {
   const {email} = req.query;
   const getDataSQL = 'SELECT b.*, t.* FROM booking AS b JOIN tables AS t ON b.table_id = t.table_id WHERE b.email = ?';
   con.query(getDataSQL, [email], (getError, getResult) => {
    if (getError) {
        console.error('Error fetching data:', getError);
        res.status(500).send('Error fetching data');
        return;
    }
    res.json(getResult)
   })
})

module.exports = app;