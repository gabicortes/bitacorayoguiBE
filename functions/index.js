const functions = require("firebase-functions");
const axios = require("axios").default;
const config = require("./config");
const cors = require("cors")({ origin: true });

let token = config.first_token;

exports.photos = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      const photosResponse = await axios.get(
        `https://graph.instagram.com/me/media?fields=media_url,permalink,comments_count&access_token=${token}`
      );

      response.send(photosResponse.data);
    } catch (error) {
      console.log(error);

      response.send(error);
    }
  });
});

exports.refreshToken = functions.pubsub
  .schedule("every 480 hours")
  .onRun(async (context) => {
    try {
      const refreshResponse = await axios.get(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
      );

      token = refreshResponse.data.access_token;

      console.log("Successfully updated token", { token });
    } catch (error) {
      console.log(error);
    }

    return null;
  });
