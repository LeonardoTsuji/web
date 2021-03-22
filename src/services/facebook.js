import * as queryString from "query-string";

const stringifiedParams = queryString.stringify({
  client_id: process.env.REACT_APP_FACEBOOK_ID,
  redirect_uri: "http://localhost:3000/auth/facebook/",
  scope: ["email", "user_friends"].join(","), // comma seperated string
  response_type: "code",
  auth_type: "rerequest",
  display: "popup",
});

const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;

export default facebookLoginUrl;
