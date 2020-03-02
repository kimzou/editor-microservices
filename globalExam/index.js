import express from "express";
import mongoose from 'mongoose';
import dotenv from "dotenv";

import routes from "./routes/index";
import User from "./models/user";

dotenv.config();
const { MONGO_USER, MONGO_PASS, MONGO_DB } = process.env;
const app = express();

// mongoose
//     .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@dnd-dtit4.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
//         { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         app.listen(4004).then(({ url }) => {
//             console.log(`Server listening on ${url}`);
//         });
//     })
//     .catch(e => console.error(e));

mongoose
    .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@dnd-dtit4.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) { console.log({err}) }
        app.listen(4004, () => {
            console.log(`Server listening on port 4004`);
        });
    })
    .catch(e => console.error(e));


// app.use("/", routes);

app.get("/", (req, res) => {
    console.log("express hello world");
    res.send("<h1>HELLO WORLD</h1>");
    // res.redirect("/globalExam");
});

app.get("/user", async ({ query: { token }}, res) => {
    // console.log({req})
    try {
        console.log("req token", {token});
        const user = await User.findById(token);
        res.json(user).status(200);
    } catch (error) {
        console.error("error in user/:token", error)
    }
});

app.get("/globalExam/:token", async ({ params: { token } }, res) => {
    // const token = req.params.token;
});

// app.listen(4004, () => console.log("globalEx listening on port 4050"));