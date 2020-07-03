const { RemoteGraphQLDataSource } = require("@apollo/gateway");

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
        console.log(
          "wwwwwwwill recived context request.http.headers",
          request.http.headers.get("x-token")
        );
  }

  async didReceiveResponse({ response, request, context }) {
      console.log("dddddddid recived context access", context.accessToken);
    //   console.log("=== did response", response.http.headers.cookie);
    //   console.log("=== did response.data", response.data);

    // Parse the Server-Id header and add it to the array on context
    const accessToken = context.accessToken ? context.accessToken : null;
    // console.log("response.data.login", response.data.login);
    // console.log("response.data.login.token", response.data.login.token);

    // if response login exists, set the given token to the http cookie
    if (response.data.login) {
        console.log("in if", response.data.login.token);
        context.res.cookie("x-token", response.data.login.token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          path: "/"
        });
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
