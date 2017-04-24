import express from 'express'
import forceSSL from 'express-force-ssl'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import {errorHandler as queryErrorHandler} from 'querymen'
import {errorHandler as bodyErrorHandler} from 'bodymen'
import {env, mongo} from '../../config'
import session from 'express-session'
import MongoDBStore from 'connect-mongodb-session'


export default (routes) => {
  const app = express()

  /* istanbul ignore next */
  // if (env === 'production') {
  //   app.set('forceSSLOptions', {
  //     enable301Redirects: false,
  //     trustXFPHeader: true
  //   });
  //   app.use(forceSSL)
  // }


  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({extended: false}))

  app.use(bodyParser.json())

  var mongoDbStore = MongoDBStore(session);
  var store = new mongoDbStore(
    {
      uri: mongo.uri,
      collection: 'mySessions'
    });
  app.use(session({
    secret: 'SECRET_a4f8071fR-c873-4447-8ee2',

    name: 'session',
    store: store, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
  })); // session secret

  app.use(express.static('../app'));

  app.use("/*.js", express.static('../app'));
  app.use(routes)
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())

  app.all('/', function (req, res) {
    var path = require('path');
    res.sendFile(path.resolve(__dirname + '/../../../app/index.html'));
  });

  return app
}
