import {success, notFound} from '../../services/response/'
import {EducationLevel} from '.'

export const show = (req, res, next) => {
 console.log('adasd');
  EducationLevel.find({})
    .then((levels) => levels.map((level) => level.view()))
    .then(success(res))
    .catch(next)
}
