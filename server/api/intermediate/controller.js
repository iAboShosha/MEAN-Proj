import {success, notFound} from '../../services/response/'
import {Intermediate} from '.'

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  Intermediate.find(query, select, cursor)
    .then((intermediates) => intermediates.map((intermediate) => intermediate.view()))
    .then(success(res))
    .catch(next)

export const show = ({params}, res, next) =>
  Intermediate.findById(params.id)
    .then(notFound(res))
    .then((intermediate) => intermediate ? intermediate.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({intermediate}, res) =>
  res.json(intermediate.view());

export const create = ({bodymen: {body}}, res, next) => {

  Intermediate.create(body)
    .then((intermediate) => intermediate.view())
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

export const update = ({bodymen: {body}, params, intermediate}, res, next) => {
  Intermediate.findById(intermediate.id === 'me' ? intermediate.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = intermediate.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      return result
    })
    .then((intermediate) => intermediate ? _.merge(intermediate, body).save() : null)
    .then((intermediate) => intermediate? intermediate.view() : null)
    .then(success(res))
    .catch(next)
};

export const destroy = ({params}, res, next) =>
  Intermediate.findById(params.id)
    .then(notFound(res))
    .then((intermediate) => intermediate ? intermediate.remove() : null)
    .then(success(res, 204))
    .catch(next);
