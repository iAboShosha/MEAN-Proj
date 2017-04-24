import mongoose, {Schema} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import {env} from '../../config'


const contactUsSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  mobile: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})


const model = mongoose.model('ContactUs', contactUsSchema)

export const schema = model.schema
export default model
