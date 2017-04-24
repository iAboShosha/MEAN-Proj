/**
 * Created by iAboShosha on 4/18/17.
 */

import _ from 'lodash'
import {success, notFound} from '../../services/response/'
import {School} from '.'


export const index = ({querymen: {query, select, cursor}, user}, res, next) => {
  query.$or = [{user: user.id}, {isVerified: true}];
  School.find(query, select, cursor)
    .then((schools) => schools.map((school) => school.view()))
    .then(success(res))
    .catch(next)
}


export const show = ({params, user}, res, next) =>
  School.findOne({user: user.id})
    .then(notFound(res))
    .then((school) => school ? school.view(true) : null)
    .then(success(res))
    .catch(next)

export const create = ({bodymen: {body}, user}, res, next) => {
  body.user = user.id;
  School.create(body)
    .then((school) => school.view(true))
    .then(success(res, 201))
    .catch(next)
}

export const update = ({bodymen: {body}, params, user}, res, next) => {
  School.findById(body.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = user.role === 'admin'
      const isSelfUpdate = user.id === result.user
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change school\'s data'
        })
        return null
      }
      return result
    })
    .then((school) => school ? _.merge(school, body).save() : null)
    .then((school) => school ? school.view(true) : null)
    .then(success(res))
    .catch(next)
}
