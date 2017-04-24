import {Router} from 'express'
import {middleware as query} from 'querymen'
import {middleware as body} from 'bodymen'
import {index} from './controller'
import {schema} from './model'
export City, {schema} from './model'

const router = new Router()

/**
 * @api {get} /city Retrieve cities
 * @apiName RetrieveCities
 * @apiGroup city
 * @apiSuccess {Object[]} city List of cities.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index);

export default router
