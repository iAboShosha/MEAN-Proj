/**
 * Created by iAboShosha on 4/18/17.
 */
import {Router} from 'express'
import {middleware as query} from 'querymen'
import {middleware as body} from 'bodymen'
import {master, token} from '../../services/passport'
const router = new Router()
import {show} from './controller'
import {schema} from './model'
export EducationLevel from './model'

router.get('/',
  show);

export default router
