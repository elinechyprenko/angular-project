const { con } = require('../db/db.config');
let express = require('express');
const app = express();

app.delete('/booking/:table_id', (req, res) => {
    const table_id = req.params.table_id;
    const deleteBookingSql = 'DELETE from booking WHERE table_id = ?';
    const updateTableSql = 'UPDATE tables SET status=null WHERE table_id=?';

    con.query(deleteBookingSql, [table_id], (deleteError, deleteResult) => {
        if (deleteError) {
            console.error(deleteError);
            return res.status(500).send({ status: 'error', message: 'Failed to delete booking' });
        }
        con.query(updateTableSql, [table_id], (updateError, updateResult) => {
            if (updateError) {
                console.error(updateError);
                return res.status(500).send({ status: 'error', message: 'Failed to update table status' });
            };
            res.status(200).send({ status: 'success', message: 'Booking deleted successfully' });
        })
    })
});

module.exports = app;