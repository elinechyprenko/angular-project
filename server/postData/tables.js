const { con } = require('../db/db.config');
let express = require('express');
const app = express();

app.post('/tables', (req, res) => {
  const { people, time, date } = req.body;
  const checkTableSql = 'SELECT * FROM tables WHERE date = ? AND time = ? AND number_of_seats = ?';
  const createTableSql = 'INSERT INTO tables (date, time, number_of_seats) VALUES (?, ?, ?)';
  const checkBusyTableSql = 'SELECT * FROM tables WHERE date = ? AND time = ? AND number_of_seats = ? AND status = "ok"';

  con.query(checkTableSql, [date, time, people], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send({ status: 'error', message: 'Database query error' });
    }
    if (result.length > 0) return res.status(200).send({ status: 'available', table_id: result[0].table_id });
    con.query(checkBusyTableSql, [date, time, people], (busyError, busyResult) => {
      if (busyError) {
        console.error(busyError);
        return res.status(500).send({ status: 'error', message: 'Database query error' });
      }
      if (busyResult.length > 0) return res.status(200).send({ status: 'busy' });
      else if (result.status !== 'available' && busyResult.status !== 'busy') {
        con.query(createTableSql, [date, time, people], (createError, createResult) => {
          if (createError) {
            console.error(createError);
            return res.status(500).send({ status: 'error', message: 'Failed to create new table' });
          }
          return res.status(200).send({ status: 'created', table_id: createResult.insertId });
        });
      }
    });
  });
});

module.exports = app;