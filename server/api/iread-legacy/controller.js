import {success, notFound} from '../../services/response/'
import {IReadLegacy} from '.'

export const show = ({params, user}, res, next) => {
  IReadLegacy.find({email: user.email})
    .then(notFound(res))
    .then((participates) => participates.map( participate => participate.view(true)))
    .then(success(res))
    .catch(next);
};
