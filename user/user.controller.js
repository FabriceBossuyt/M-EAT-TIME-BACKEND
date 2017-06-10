'use strict'

var router = express.Router();
var User = require('./user.model.js');
var crypto = require('crypto');

router.post('/password-reset', function (req, res) {
  var email = req.body.email;
  var user = User.forge({ email: email });

  user.fetch().then(function (model) {
    if (model && !model.facebook_id) {
      var token = crypto.randomBytes(64).toString('hex');
      user.save({ password_reset_token: token, password_reset_token_ttl: moment().add(1, 'hours')}).then(function(response){
        sendMail(response.attributes)
      })
    }
    else
      res.json({ success: false, msg: 'No such user' })
  })
});

function sendMail(user){
  //
}

module.exports = router;