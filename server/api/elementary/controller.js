import {success, notFound} from '../../services/response/'
import {Elementary} from '.'

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  Elementary.find(query, select, cursor)
    .then((elementarys) => elementarys.map((elementary) => elementary.view()))
    .then(success(res))
    .catch(next)

export const show = ({params}, res, next) =>
  Elementary.findById(params.id)
    .then(notFound(res))
    .then((elementary) => elementary ? elementary.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({elementary}, res) =>
  res.json(elementary.view());

export const create = ({bodymen: {body}}, res, next) => {

  Elementary.create(body)
    .then((elementary) => elementary.view())
    .then(success(res, 201))
    .catch((err) => {
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
};

export const update = ({bodymen: {body}, params, elementary}, res, next) => {
  Elementary.findById(elementary.id === 'me' ? elementary.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = elementary.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      return result
    })
    .then((elementary) => elementary ? _.merge(elementary, body).save() : null)
    .then((elementary) => elementary? elementary.view() : null)
    .then(success(res))
    .catch(next)
};

export const destroy = ({params}, res, next) =>
  Elementary.findById(params.id)
    .then(notFound(res))
    .then((elementary) => elementary ? elementary.remove() : null)
    .then(success(res, 204))
    .catch(next);
