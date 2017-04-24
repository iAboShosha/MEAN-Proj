import {Router} from 'express'
import {middleware as query} from 'querymen'
import {middleware as body} from 'bodymen'
import {index} from './controller'
import {schema} from './model'
export Region, {schema} from './model'

const router = new Router()

/**
 * @api {get} /region Retrieve regions
 * @apiName RetrieveRegions
 * @apiGroup region
 * @apiSuccess {Object[]} region List of regions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index);

export default router
