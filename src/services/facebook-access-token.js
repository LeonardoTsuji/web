import axios from "axios";

async function getAccessTokenFromCode(code) {
  const { data } = await axios({
    url: "https://graph.facebook.com/v4.0/oauth/access_token",
    method: "get",
    params: {
      client_id: process.env.REACT_APP_FACEBOOK_ID,
      client_secret: process.env.REACT_APP_FACEBOOK_SECRET,
      redirect_uri: process.env.REACT_APP_FACEBOOK_REDIRECT_URI,
      code,
    },
  });
  console.log(data); // { access_token, token_type, expires_in }
  return data.access_token;
}

module.exports = getAccessTokenFromCode;
