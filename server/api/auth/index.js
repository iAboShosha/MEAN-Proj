import {Router} from 'express'
import {login} from './controller'
import {password, master, facebook, google, windowLive, twitter, twitterCallback} from '../../services/passport'
import User from './../user/model'
const router = new Router();
import jwt from 'jwt-simple';
import moment from 'moment';
import config from './../../config'
import request from 'request'
import qs  from 'querystring'
/**
 * @api {post} /auth Authenticate
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiPermission master
 * @apiHeader {String} Authorization Basic authorization with email and password.
 * @apiParam {String} access_token Master access_token.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Master access only or invalid credentials.
 */
router.post('/',
  //master(),
  password(),
  login)

/**
 * @api {post} /auth/facebook Authenticate with Facebook
 * @apiName AuthenticateFacebook
 * @apiGroup Auth
 * @apiParam {String} access_token Facebook user accessToken.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Invalid credentials.
 */
router.post('/facebook',
  facebook(),
  login)

/**
 * @api {post} /auth/google Authenticate with Google
 * @apiName AuthenticateGoogle
 * @apiGroup Auth
 * @apiParam {String} access_token Google user accessToken.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Invalid credentials.
 */
router.post('/google',
  google(),
  login)

router.post('/live',
  windowLive(),
  login)

// import {getUser} from '../../services/twitter'
// import User from '../../api/user/model'
// router.post('/twitter',
//   getUser
// )

// router.get('/twitter',
//   getUser
// )
//
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.jwtSecret);
}
function tw(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';

  console.log('----headers-----',req.headers);
  // Part 1 of 2: Initial request from Satellizer.

  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({url: requestTokenUrl, oauth: requestTokenOauth}, function (err, response, body) {
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({url: accessTokenUrl, oauth: accessTokenOauth}, function (err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        token: accessToken.oauth_token,
        token_secret: accessToken.oauth_token_secret,
      };

      // Step 4. Retrieve user's profile information and email address.
      request.get({
        url: profileUrl,
        qs: {include_email: true},
        oauth: profileOauth,
        json: true
      }, function (err, response, profile) {

        // Step 5a. Link user accounts.
        if (req.header('Authorization')) {
          User.findOne({'services.twitter': profile.id}, function (err, existingUser) {
            if (existingUser) {
              return res.send({token: createJWT(existingUser),user:existingUser});
            }

            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);

            User.findById(payload.sub, function (err, user) {
              if (!user) {
                return res.status(400).send({message: 'User not found'});
              }

              user.service.twitter = profile.id;
              user.email = profile.email;
              user.username = user.username || profile.name;
              user.picture = user.picture || profile.profile_image_url_https.replace('_normal', '');
              user.save(function (err) {
                res.send({token: createJWT(user)});
              });
            });
          });
        } else {
          // Step 5b. Create a new user account or return an existing one.
          User.findOne({'service.twitter': profile.id}, function (err, existingUser) {
            if (existingUser) {
              return res.send({token: createJWT(existingUser)});
            }

            var user = new User();
            user.services.twitter = profile.id;
            user.email = profile.email;
            user.username = profile.name;
            user.picture = profile.profile_image_url_https.replace('_normal', '');
            user.save(function () {
              res.send({token: createJWT(user),user:user});
            });
          });
        }
      });
    });
  }
}
router.post('/twitter', tw);
router.get('/twitter', tw);

export default router
