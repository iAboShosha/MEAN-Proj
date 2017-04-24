import {success, notFound} from '../../services/response/'
import {City} from '.'

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  City.find(query, select, cursor).limit(3700 )
    .then((cities) => cities.map((city) => city.view()))
    .then(success(res))
    .catch(next);
