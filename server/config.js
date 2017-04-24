/* eslint-disable no-unused-vars */
import path from 'path'
import _ from 'lodash'


/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
const dotenv = require('dotenv-safe')
if (process.env.NODE_ENV !== 'production') {
  dotenv.load({
    path: path.join(__dirname, './.env'),
    sample: path.join(__dirname, './.env.example')
  })
} else {
  dotenv.load({
    path: path.join(__dirname, './.env.pro'),
    sample: path.join(__dirname, './.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9001,
    ip: process.env.IP || '0.0.0.0',
    defaultEmail: 'no-reply@iread.com',
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    captchaSecretKey: requireProcessEnv('CAPTCHA_SECRET_KEY'),
    captchaSiteKey: requireProcessEnv('CAPTCHA_SITE_KEY'),
    systemEmail: process.env.SYSTEM_EMAIL || 's@gmail.com',
    TWITTER_KEY: '',

    TWITTER_SECRET: '',


    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: {
    mongo: {
      uri: 'mongodb://localhost/iread-test',
      options: {
        debug: false
      }
    }
  },
  development: {
    mongo: {
      uri: 'mongodb://localhost/iread-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || '127.0.0.1',
    port: process.env.PORT || 9180,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:19860/iread'
    }
  }
}

if (!config.hasOwnProperty(config.all.env)) {
  config.all.env = 'development';
}

module.exports = _.merge(config.all, config[config.all.env])
export default module.exports
