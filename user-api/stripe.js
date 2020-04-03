const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY); 

module.exports = stripe;