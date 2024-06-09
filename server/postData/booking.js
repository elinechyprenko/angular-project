const { con } = require('../db/db.config');
let express = require('express');
const app = express();

app.post('/booking', (req, res) => {
  const { fullName, phone, email, request, occasion, table_id } = req.body;
  const insertSQL = 'insert into booking(full_name,phone,email,request,occasion,table_id) values (?,?,?,?,?,?)';
  const bookingValues = [fullName, phone, email, request, occasion, table_id]
  con.query(insertSQL, bookingValues, (bookingError, bookingResult) => {
    if (bookingError) {
      console.log(bookingError);
      return res.status(500).send({ status: 'error', message: 'Failed to book the table' });
    }
    const updateStatusSQL = 'update tables set status="ok" where table_id=?';
    con.query(updateStatusSQL, [table_id], (updateError, updateResult) => {
      if (updateError) {
        console.error(updateError);
        return res.status(500).send({ status: 'error', message: 'Failed to update table status' });
      }
      else {
        res.status(200).send({ status: 'success', message: 'Table booked successfully' });
      }
    })
  })
});

module.exports = app;