import {success, notFound} from '../../services/response/'

export const uploadFile = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({filename: req.files[0].filename}));
}
