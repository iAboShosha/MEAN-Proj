/**
 * Created by iAboShosha on 4/18/17.
 */
import {Router} from 'express'
import {show} from './controller'
import {middleware as query} from 'querymen'
import {middleware as body} from 'bodymen'
import {master, token} from '../../services/passport'
const router = new Router()
import {index, create, update} from './controller'
import {schema} from './model'
export ContactUs, {schema} from './model'
const {
  name, mobile, email, subject, message
} = schema.tree

// router.get('/',
//   token({required: true, roles: ['admin']}),
//   query(),
//   index);


router.post('/',
  //token({required: true}),
  body({
    name, mobile, email, subject, message, sendMeCopy: {type: Boolean}
  }),
  create);


export default router
