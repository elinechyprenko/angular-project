let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
const { con } = require('./db/db.config');
const app = express();

const dataProducts = require('./getData/products')
const dataImage = require('./getData/images');
const dataAdditions = require('./getData/additions');
const checkEmail = require('./getData/checkEmail');
const checkPhone = require('./getData/checkPhone');
const register = require('./postData/register');
const login = require('./postData/login');
const tables = require('./postData/tables');
const booking = require('./postData/booking');
const deleteBooking = require('./deleteData/deleteBooking');
const checkReservation = require('./postData/checkReservation');
const paymentIntent = require('./postData/paymentIntent');
const order = require('./postData/order');
const changePassword = require('./postData/changePassword');
const dining = require('./postData/dining');
const getReservationTables = require('./getData/reservationTables');
const getOrderData = require('./getData/orderData');

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(dataImage);
app.use(dataProducts);
app.use(dataAdditions);
app.use(checkEmail);
app.use(checkPhone);
app.use(register);
app.use(login);
app.use(tables);
app.use(booking);
app.use(deleteBooking);
app.use(checkReservation);
app.use(paymentIntent);
app.use(order);
app.use(changePassword);
app.use(dining);
app.use(getReservationTables);
app.use(getOrderData);

con.connect(function (error) {
    if (error) throw error
    console.log('SQL works!')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



