const {con} = require('../db/db.config');
let express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51PMATzRuVY5NUwIvonl8PivbQUHStfEllzthCNcCBFh5SmJm38uFw03n4IPtOrhBUcQVJlQynUZ3cEgyXuTF7xXa002MKmNzEv'); // Ваш секретный ключ Stripe

app.post('/create-payment-intent', async (req, res) => {
    const { total_price } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total_price * 100, // Сумма в центах
        currency: 'usd',
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  module.exports = app;