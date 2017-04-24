import passport from 'passport'
import {Schema} from 'bodymen'
import {BasicStrategy} from 'passport-http'
import {Strategy as BearerStrategy} from 'passport-http-bearer'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'
import {jwtSecret, masterKey} from '../../config'
import * as facebookService from '../facebook'
import * as googleService from '../google'
import * as windowsLiveService from '../windowslive'
import User, {schema} from '../../api/user/model'
import TwitterStrategy from 'passport-twitter'
import twitterService from '../twitter'
export const password = () => (req, res, next) =>{
  console.log('----headers-----',req.headers);
  passport.authenticate('password', {session: false}, (err, user, info) => {
    if (err && err.param) {
      return res.status(400).json(err)
    } else if (err || !user) {
      return res.status(401).end()
    }
    req.logIn(user, {session: false}, (err) => {
      if (err) return res.status(401).end()
      next()
    })
  })(req, res, next)
}

export const facebook = () =>
  passport.authenticate('facebook', {session: false})


export const google = () =>
  passport.authenticate('google', {session: false})

export const master = () =>
  passport.authenticate('master', {session: false})

export const windowLive = () =>
  passport.authenticate('live', {session: false})


export const token = ({required, roles = User.roles} = {}) => (req, res, next) => {
  console.log('----headers-----', req.headers);
  passport.authenticate('token', {session: false}, (err, user, info) => {
    if (err || (required && !user) || (required && !~roles.indexOf(user.role))) {
      return res.status(401).end()
    }
    req.logIn(user, {session: false}, (err) => {
      if (err) {
        return res.status(401).end()
      }
      next()
    })
  })(req, res, next)
}

passport.use('password', new BasicStrategy((email, password, done) => {
  const userSchema = new Schema({email: schema.tree.email, password: schema.tree.password})

  userSchema.validate({email, password}, (err) => {
    if (err) done(err)
  })

  User.findOne({email}).then((user) => {
    if (!user) {
      done(true)
      return null
    }
    return user.authenticate(password, user.password).then((user) => {
      done(null, user)
      return null
    }).catch(done)
  })
}))

passport.use('facebook', new BearerStrategy((token, done) => {
  facebookService.getUser(token).then((user) => {
    if (user.email) {
      return User.createFromService(user)
    }
  }).then((user) => {
    if (user) {
      done(null, user)
      return null
    } else {
      done(null, false, {error: 'missing email address'})
    }
  }).catch(done)
}));

passport.use('google', new BearerStrategy((token, done) => {
  googleService.getUser(token).then((user) => {
    return User.createFromService(user)
  }).then((user) => {
    done(null, user)
    return null
  }).catch(done)
}))

passport.use('live', new BearerStrategy((token, done) => {
  windowsLiveService.getUser(token).then((user) => {
    return User.createFromService(user)
  }).then((user) => {
    done(null, user)
    return null
  }).catch(done)
}))

// export const twitter = () => {
//     console.log(11)
//     twitterService.getUser().then((user) => {
//       return User.createFromService(user)
//     }).then((user) => {
//       done(null, user)
//       return null
//     }).catch(done)
//   }
//
//   ;


passport.use('master', new BearerStrategy((token, done) => {
  if (token === masterKey) {
    done(null, {})
  } else {
    done(null, false)
  }
}))

passport.use('token', new JwtStrategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('access-token'),
    ExtractJwt.fromBodyField('access-token'),
    //ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    ExtractJwt.fromHeader('access-token'),
    ExtractJwt.fromHeader('authorization2'),
  ])
}, ({id}, done) => {

  User.findById(id).then((user) => {
    done(null, user)
    return null
  }).catch(done)
}))
