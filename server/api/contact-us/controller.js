/**
 * Created by iAboShosha on 4/18/17.
 */


import {success} from '../../services/response/'
import {ContactUs} from '.'
import {sendMail} from '../../services/sendgrid'
import {systemEmail} from '../../config'

export const create = ({bodymen: {body}}, res, next) => {

  ContactUs.create(body)
    .then(contactUs=> {
      if (body.sendMeCopy) {

        const message = `
        Dear ${body.name}<br><br>
        thanks for contact us we will reply as soon as possible your message was :<br><br>
        ${body.message}<br><br>

        Best wishes<br><br>
        iReadAward Team<br><br>
      `
        sendMail({toEmail: contactUs.email, subject: "iReadAward - Contact us", content: message})

      }
      const systemMesssage = `user name : ${contactUs.name}<br><br>
        user mobile: ${contactUs.mobile}<br><br>
        user email : ${contactUs.email}<br><br>
        
        [ ${contactUs.subject} ]<br><br>
         
         ${contactUs.message}<br><br>
         
         sent at ${Date.now()}<br><br>
`
      return sendMail({toEmail: systemEmail, subject: 'iReadAward - contact us from', content: systemMesssage})
    })

    .then(success(res, 201))
    .catch(next)
}

