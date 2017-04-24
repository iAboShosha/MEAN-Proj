/**
 * Created by iAboShosha on 4/18/17.
 */
import {Router} from 'express'
import {show} from './controller'
import {middleware as query} from 'querymen'
import {middleware as body} from 'bodymen'
import {master, token} from '../../services/passport'
const router = new Router()
import {schema} from './model'
export IReadLegacy, {schema} from './model'
const {
  email,
  schoolLevel, schoolName, UniversityName,
  bookName, bookAuthor, bookSummary, whyThisBook, twitAboutBook, whyReading, storyWithReading,
  year
  } = schema.tree

router.get('/',
  token({required: true}),
  show);

export default router
