import {Router} from 'express'
import {middleware as query} from 'querymen'
import {middleware as body} from 'bodymen'
import {index, showMe, show, create, update, destroy, updateStatus} from './controller'
import {schema} from './model'
import {password as passwordAuth, master, token} from '../../services/passport'
export University, {schema} from './model'

const router = new Router()
const {
  userId, university, nearedCity, knowContest,
  name, author, review, reason, twit,
  story, favorites, blog, readsSite, readsReview,
  youTubeVideo, status, filesName, verificationCode, educationLevel
} = schema.tree

/**
 * @api {get} /Universitys Retrieve University users
 * @apiName RetrieveUniversitys
 * @apiGroup University
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiUse listParams
 * @apiSuccess {Object[]} users List of Universitys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 */
router.get('/',
  token({required: true, role: ['Admin']}),
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
 * @api {get} /Universitys/:userId Retrieve University
 * @apiName RetrieveUniversity
 * @apiGroup University
 * @apiPermission public
 * @apiSuccess {Object} University User's data.
 * @apiError 404 User not found.
 */
router.get('/:userId',
  token({required: true}),
  show)

/**
 * @api {post} /Universitys Create University
 * @apiName CreateUniversity
 * @apiGroup University
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
  token({required: true}),
  body({
    userId,
    university,
    nearedCity,
    knowContest
    , name, author, review, reason, twit, story,
    favorites, blog, readsSite, readsReview,
    youTubeVideo, status, filesName, verificationCode, educationLevel
  }),
  create);

/**
 * @api {put} /Universitys/:id Update University
 * @apiName UpdateUniversity
 * @apiGroup University
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
  body({
    userId,
    university,
    nearedCity,
    knowContest,
    name, author, review, reason, twit,
    story, favorites, blog, readsSite, readsReview,
    youTubeVideo, status, filesName, verificationCode, educationLevel
  }),
  update)

router.put('/updateStatus/:id',
  token({required: true}),
  body({
    status
  }),
  updateStatus)

router.put('/updateVerificationCode/:id',
  token({required: true}),
  body({
    verificationCode
  }),
  updateStatus)
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
// router.delete('/:id',
//   token({required: true, roles: ['admin']}),
//   destroy)

export default router
