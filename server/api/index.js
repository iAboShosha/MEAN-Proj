import {Router} from 'express'
import user from './user'
import auth from './auth'
import goodreads from './goodreads'
import passwordReset from './password-reset'
import school from './school'
import university from './university'
import highschool from './highschool'
import intermediate from './intermediate'
import elementary from './elementary'
import region from './region'
import city from './city'
import contactUs from './contact-us'
import educationLevel from './education-level'
import ireadLegacy from './iread-legacy'
import upload from './upload'

const router = new Router()

/**
 * @apiDefine master Master access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine admin Admin access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine user User access only
 * You must pass `access_token` parameter or a Bearer Token authorization header
 * to access this endpoint.
 */
/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */
router.use('/users', user)
router.use('/auth', auth)
router.use('/goodreads', goodreads)
router.use('/password-resets', passwordReset)
router.use('/api/school', school)
router.use('/university', university)
router.use('/highschool', highschool)
router.use('/intermediate', intermediate)
router.use('/elementary', elementary)
router.use('/region', region)
router.use('/city', city)
router.use('/contact-us', contactUs)
router.use('/education-level', educationLevel)
router.use('/iread-legacy', ireadLegacy)
router.use('/upload', upload)

export default router
