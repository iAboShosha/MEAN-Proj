import {success, notFound} from '../../services/response/'
import {Region} from '.'

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  Region.find(query, select, cursor)
    .then((regions) => regions.map((region) => region.view()))
    .then(success(res))
    .catch(next);
