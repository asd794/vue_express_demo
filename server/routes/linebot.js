// var express = require('express');
// var router = express.Router();
// router.post('/callback', function(req, res, next) {
//   res.send('Hello API');
// });
// module.exports = router;


var express = require('express');
var router = express.Router();
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: 'kBzWuuclN/gpyy4wU69W5zZ753+Y+47OW0iploWs6Q8JUaBR2MRXtUNGfgYgGKv+7Dj7IzQSCbdud9hJm0DKGupTCKbE+0hZOOQy56fjah5r7uLIsLwd8S+wUWMTsoXGQt27qTsXdhVA+LVCo3GctwdB04t89/1O/w1cDnyilFU=',
  channelSecret: '38b56a755fbb613c64a45340808dd427',
};
const client = new line.Client(config);
router.post('/callback', line.middleware(config), function (req, res, next) {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }
  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };
  // use reply API
  return client.replyMessage(event.replyToken, echo);
}
module.exports = router;