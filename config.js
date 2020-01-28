const mongoose = require('mongoose');
const url = "mongodb+srv://admin:lol@mimodnd-5cu8p.mongodb.net/admin-ionisx?retryWrites=true&w=majority";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });