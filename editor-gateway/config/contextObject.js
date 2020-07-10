const { RemoteGraphQLDataSource } = require("@apollo/gateway");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET, REFRESH_SECRET } = process.env;
// const { verify } = require("jsonwebtoken");

class ContextObject extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    // pass the user's id from the context to underlying services
    // as a header called `user-id`
    // console.log(`Send Context To [${name}] at ${url}`, request);
    // console.log("will send Context : ", context);
    request.http.headers.set(
      "x-token", // null
      context.accessToken ? context.accessToken : null
    );
    request.http.headers.set(
      "x-refresh-token", // null
      context.refreshToken ? context.refreshToken : null
    );
    console.log("++++++wiiil", request.http.headers);
  }

  async didReceiveResponse({ response, request, context }) {
    // console.log("dddddddid recived context access", context.accessToken);
    console.log("=== did response", response.http.headers.cookie);
    console.log("++++++did request", request.http.headers);

    //   console.log("=== did response.data", response.data);

    // Parse the Server-Id header and add it to the array on context
    const cxtAccessToken = context.accessToken ? context.accessToken : null;
    // const loginToken = response.data.login ? response.data.login.token : null;
    // const refreshToken = response.data.login ? response.data.login.refreshToken : null;
    const cxtRefreshToken = context.refreshToken ? context.refreshToken : null;
    // console.log("response.data.login", response.data.login);
    // console.log("response.data.login.token", response.data.login.token);
    console.log("didddd recived", { cxtAccessToken, cxtRefreshToken });
    if (cxtAccessToken && cxtRefreshToken) return response;
    // if response login exists, set the given token to the http cookie
    // if accessToken exists, x-token is already set
    // let accessToken = response.data.login.token;
    // let singedCookie = cookieParser.singedCookie(accessToken, process.env.SECRET);
    // console.log("singned cookie", singedCookie)
    console.log("ddiiddd recived response.data.login", response.data.login);
    const accessToken = response.data.login ? response.data.login.token : null;
    const refreshToken = response.data.login
      ? response.data.login.refreshToken
      : null;
    if (!accessToken || !refreshToken) return response;
    console.log("if")
    try {
      console.log("diiiidd recived", { accessToken, refreshToken });
      const decodedAccessToken = jwt.verify(accessToken, SECRET);
      console.log({ decodedAccessToken });
      const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_SECRET);
      console.log({ decodedRefreshToken });

      context.res.cookie("x-token", accessToken, {
        httpOnly: true,
        signed: true,
        //TODO: modify to 15 minutes
        maxAge: 1000 * 60,
        path: "/"
      });

      context.res.cookie("x-refresh-token", refreshToken, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        path: "/"
      });
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError &&
        error.name == "TokenExpiredError"
      ) {
        //TODO: refresh token
      }
      console.error(error);
      return response;
    }

    // console.log("__did recived access token___", accessToken)
    // if (serverId) {
    //   context.serverIds.push(serverId);
    // }

    // console.log("context : ", context);
    // console.log("response : ", response.http.headers.cookies);
    // console.log("set cookie", response)
    // console.log(" cookie : ", response.http.headers["set-cookie"]);
    // console.log("request : ", request.http.headers); //x-token is null
    // // Return the response, even when unchanged.
    // if (accessToken) {
    // console.log('Access Token : ', accessToken)
    //   response.cookie("x-acc", accessToken, {
    //     //   domain:
    //     //     process.env.NODE_ENV === "development"
    //     //       ? process.env.LOCAL_DOMAIN
    //     //       : process.env.APP_DOMAIN,
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     maxAge: 1000 * 60 * 60 * 24 * 7 // 7 Days Cookie
    //   });
    // }

    return response;
  }
}

module.exports = {
  ContextObject
};
