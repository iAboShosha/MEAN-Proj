import {Router} from 'express'
import {middleware as query} from 'querymen'
import {middleware as body} from 'bodymen'
import {index, showMe, show, create, update, destroy} from './controller'
import {schema} from './model'
import {password as passwordAuth, master, token} from '../../services/passport'
export Highschool, {schema} from './model'

const router = new Router()
const {personalInfo: {firstName, lastName, nationalId, gender, dob, city, mobile, mobileOther, school, mobileParent, email, twitter, nearedCity, knowContest},
  book: {name, author, review, reason, twit},
  reading: {story, favorites, blog, readsSite, readsReview},
  files: {youTubeVideo}} = schema.tree

/**
 * @api {get} /highschools Retrieve highschool users
 * @apiName Retrievehighschools
 * @apiGroup highschool
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiUse listParams
 * @apiSuccess {Object[]} users List of highschools.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 */
router.get('/',
  token({required: true, roles: ['admin']}),
  query(),
  index)

/**
 * @api {get} /users/me Retrieve current user
 * @apiName RetrieveCurrentUser
 * @apiGroup User
 * @apiPermission user
 * @apiParam {String} access_token User access_token.
 * @apiSuccess {Object} user User's data.
 */
router.get('/me',
  token({required: true}),
  showMe)

/**
 * @api {get} /highschools/:id Retrieve highschool
 * @apiName Retrievehighschool
 * @apiGroup highschool
 * @apiPermission public
 * @apiSuccess {Object} highschool User's data.
 * @apiError 404 User not found.
 */
router.get('/:id',
  show)

/**
 * @api {post} /highschools Create highschool
 * @apiName Createhighschool
 * @apiGroup highschool
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiParam {String} email User's email.
 * @apiParam {String{6..}} password User's password.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiParam {String=user,admin} [role=user] User's picture.
 * @apiSuccess (Sucess 201) {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 * @apiError 409 Email already registered.
 */
router.post('/',
  body({personalInfo: {firstName, lastName, nationalId, gender, dob, city, mobile, mobileOther, school, mobileParent, email, twitter, nearedCity, knowContest},
        book: {name, author, review, reason, twit},
        reading: {story, favorites, blog, readsSite, readsReview},
        files: {youTubeVideo}}),
  create);

/**
 * @api {put} /highschools/:id Update highschool
 * @apiName Updatehighschool
 * @apiGroup highschool
 * @apiPermission user
 * @apiParam {String} access_token User access_token.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Current user or admin access only.
 * @apiError 404 User not found.
 */
router.put('/:id',
  token({required: true}),
  body({personalInfo: {firstName, lastName, nationalId, gender, dob, city, mobile, mobileOther, school, mobileParent, email, twitter, nearedCity, knowContest},
    book: {name, author, review, reason, twit},
    reading: {story, favorites, blog, readsSite, readsReview},
    files: {youTubeVideo}}),
  update)

/**
 * @api {delete} /users/:id Delete user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 401 Admin access only.
 * @apiError 404 User not found.
 */
router.delete('/:id',
  token({required: true, roles: ['admin']}),
  destroy)

export default router
