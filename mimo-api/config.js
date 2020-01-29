const mongoose = require('mongoose');
require('dotenv').config();

const { MONGO_USER, MONGO_PASS, MONGO_DB } = process.env;

const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@dnd-dtit4.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });