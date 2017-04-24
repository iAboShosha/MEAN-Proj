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
export School, {schema} from './model'
const {
  name, city, mobile, region, managerName, contactName,
  type, studentsCount, latlng, email, isVerified
} = schema.tree

router.get('/',
  token({required: true}),
  query(),
  index);

router.get('/me',
  token({required: true}),
  show);

router.post('/',
  token({required: true}),
  body({
    name, city, mobile, region, managerName, contactName,
    type, studentsCount, latlng, email
  }),
  create);

router.post('/fake',
  token({required: true}),
  body({
    name
  }),
  create);

router.put('/',
  token({required: true}),
  body({
    id: String,
    name, city, mobile, region, managerName, contactName,
    type, studentsCount, latlng, email
  }),
  update);


export default router
