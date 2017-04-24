import _ from 'lodash'
import {success, notFound} from '../../services/response/'
import {User} from '.'
import {sendMail} from '../../services/sendgrid'
import {ip, port} from '../../config'

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  User.find(query, select, cursor)
    .then((users) => users.map((user) => user.view()))
    .then(success(res))
    .catch(next)

export const show = ({params}, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({user}, res) =>
  res.json(user.view(true))

export const create = ({bodymen: {body}}, res, next) => {

  User.create(body)

    .then((user)=> {
      var link = `http://${ip}:${port}/email-verify/${user.verificationCode}`;
      var email = user.email;
      const content = `
        Hey, ${user.name}.<br><br>
        You create a new iread account.<br>
        Please use the following link to verify your email.<br><br>
        <a href="${link}">${link}</a><br><br>
        If you didn't make this request then you can safely ignore this email. :)<br><br>
        &mdash; iread Team
      `;
      return sendMail({toEmail: email, subject: 'iread - Verify your E-Mail', content})
        .then(()=>user)
    })
    .then((user) => user.view(true))
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })
}
export const update = ({bodymen: {body}, params, user}, res, next) =>
  User.findById(user.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = user.role === 'admin'
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      return result
    })
    .then((user) => user ? _.merge(user, body).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const updatePassword = ({bodymen: {body}, params, user}, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: 'password',
          message: 'You can\'t change other user\'s password'
        })
        return null
      }
      return result
    })
    .then((user) => user ? user.set({password: body.password}).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const verifyAccount = ({params}, res, next)=> {
  User.findOne({verificationCode: params.key})
    .then(notFound(res))
    .then((user)=> {
      user.isVerified = true;
      user.verificationCode = null;
      return user.save()
    })
    .then(user=>user.view())
    .then(success(res))
    .catch(next)
}
export const destroy = ({params}, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)
