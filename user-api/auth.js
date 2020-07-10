const { sign, verify } = require("jsonwebtoken");
require('dotenv').config();

const { SECRET, REFRESH_SECRET } = process.env;

const setTokens = ({ user }) => {
    const sevenDays = 60 * 60 * 24 * 7 * 1000;
    const fifteenMins = 60 * 15 * 1000;

    const accessUser = {
        id: user.id
    };

    const refreshUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        count: user.tokenCount
    };

    const accessToken = sign(
        { user: accessUser },
        SECRET,
        {
            expiresIn: fifteenMins
        }
    );

    const refreshToken = sign(
        { user: refreshUser },
        REFRESH_SECRET,
        {
            expiresIn: sevenDays
        }
    );

    return { accessToken, refreshToken };
}

const validateAccessToken = ({ accessToken }) => {
    try {
        return verify(accessToken, SECRET);
    } catch (error) {
        console.error(error);
        return null;
    }
}

const validateRefreshToken = ({ refreshToken }) => {
    try {
        return verify(refreshToken, REFRESH_SECRET);
    } catch (error) {
        console.error(error);
        return null;
    }
}


module.exports = { setTokens, validateAccessToken, validateRefreshToken }