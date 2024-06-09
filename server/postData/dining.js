const {con} = require('../db/db.config');
let express = require('express');
const app = express();

app.post('/dining', (req,res) => {
    const {email,fullName, phone, date, startTime, endTime, people, natureEvent, info} = req.body;
    const sql = 'insert into group_dining (fullname,email,phone,date,start_time,end_time,people,info,nature_event) values (?,?,?,?,?,?,?,?,?)';
    con.query(sql, [fullName, email, phone, date, startTime, endTime, people,info,natureEvent] , (diningError, diningResult) => {
        if (diningError) {
            console.error('Error executing database query:', err);
            res.status(500).json({ error: 'Error saving data' });
            return;
        }
        console.log('Data successfully saved to the database');
        res.status(200).json({ message: 'Data successfully saved to the database' });
    })
});

module.exports = app;