import {Router} from 'express'
import {searchBooks} from './controller'

const router = new Router()

router.get('/searchBooks/:bookName',
  searchBooks);

export default router
