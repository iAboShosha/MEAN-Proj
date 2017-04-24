/**
 * Created by iAboShosha on 4/16/17.
 */

import request from 'request-promise'

export const getUser = (accessToken) =>
  request({
    uri: 'https://apis.live.net/v5.0/me',
    json: true,
    qs: {
      access_token: accessToken,
      fields: 'id, name, email, picture'
    }
  })
    .then(({id, name, emails}) => ({
      service: 'live',
      id,
      name,
      picture: null,
      email: emails.account
    }))
