import _ from 'lodash'
import {success, notFound} from '../../services/response/'
import {University} from '.'

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  University.find(query, select, cursor)
    .then((universityUsers) => universityUsers.map((universityUser) => universityUser.view()))
    .then(success(res))
    .catch(next)

export const show = ({params, user}, res, next) =>
  University.findOne({userId: params.userId})
    .then(notFound(res))
    .then((universityUser) => universityUser ? universityUser.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({universityUser}, res) =>
  res.json(universityUser.view());

export const create = ({bodymen: {body}, user}, res, next) => {
  body.userId = user.id;
  University.create(body)
    .then((universityUser) => universityUser.view())
    .then(success(res, 201))
    .catch((err)=> {
      console.log(err)
      next()
    })
};

export const update = ({bodymen: {body}, params, user}, res, next) => {
  University.findById(params.id)
    .then(notFound(res))
    .then((result) => {

      if (!result) return null
      const isSelfUpdate = user.id === result.userId;
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      return result
    })
    .then((universityUser) => universityUser ? _.merge(universityUser, body).save() : null)
    .then((universityUser) => universityUser ? universityUser.view() : null)
    .then(success(res))
    .catch(next)
};

export const updateStatus = ({bodymen: {body}, params}, res, next) => {
  University.findById(params.id)
    .then(notFound(res))
    .then((universityUser) => universityUser ? _.merge(universityUser, body).save() : null)
    .then((universityUser) => universityUser ? universityUser.view() : null)
    .then(success(res))
    .catch(next)
};

export const destroy = ({params}, res, next) =>
  University.findById(params.id)
    .then(notFound(res))
    .then((universityUser) => universityUser ? universityUser.remove() : null)
    .then(success(res, 204))
    .catch(next);
