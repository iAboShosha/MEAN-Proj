import {success, notFound} from '../../services/response/'
import {Highschool} from '.'

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  Highschool.find(query, select, cursor)
    .then((highschools) => highschools.map((highschool) => highschool.view()))
    .then(success(res))
    .catch(next)

export const show = ({params}, res, next) =>
  Highschool.findById(params.id)
    .then(notFound(res))
    .then((highschool) => highschool ? highschool.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({highschool}, res) =>
  res.json(highschool.view());

export const create = ({bodymen: {body}}, res, next) => {

  Highschool.create(body)
    .then((highschool) => highschool.view())
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

export const update = ({bodymen: {body}, params, highschool}, res, next) => {
  Highschool.findById(highschool.id === 'me' ? highschool.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = highschool.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      return result
    })
    .then((highschool) => highschool ? _.merge(highschool, body).save() : null)
    .then((highschool) => highschool? highschool.view() : null)
    .then(success(res))
    .catch(next)
};

export const destroy = ({params}, res, next) =>
  Highschool.findById(params.id)
    .then(notFound(res))
    .then((highschool) => highschool ? highschool.remove() : null)
    .then(success(res, 204))
    .catch(next);
