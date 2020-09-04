require('dotenv').config();
const { verify } = require("jsonwebtoken");

const User = require('../models/user');
const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

const loggingMiddleware = async (req, _, next) => {
    try {
        const accessToken = req.cookies["x-token"];
        const verifyToken = verify(accessToken, JWT_SECRET);
        const user = await User.findById(verifyToken.id);

        if(!user) new Error("No user found!");

        req.currentUser = user;
    } catch (error) {
        console.error("LogginMiddleware error", error);
    }
    next();

    // try {
    //     //TODO: verify all token ?
    //     const decodeAccessToken = verify(accessToken, JWT_SECRET);
    //     console.log({ decodeAccessToken });
    // } catch (error) {
    //     console.error(error);
    //     if (error.name && error.name === "TokenExpiredError") {
    //         //TODO: refresh token
    //     }
    // }
    // console.log("id", decodeAccessToken.id);

    // user = await User.findById(decodeAccessToken.id);

    // console.log('index user', { user })
    // // req.user = user;
    // // console.log("context req.user", req.user);
    // if (!user) return new Error("User not found");
    // return user;
}

module.exports = { loggingMiddleware };

// export const authenticated = next => (root, args, context, info) => {
//     if (!context.currentUser) {
//         throw new Error(`Unauthenticated!`);
//     }

//     return next(root, args, context, info);
// };