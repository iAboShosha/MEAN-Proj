import mongoose, {Schema} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import {env} from '../../config'
import {uid} from 'rand-token'

const schoolSchema = new Schema({
  name: {
    type: String,
    required: true
  }, email: {
    type: String,
    trim: true,
    required: true,
    default: "example@iread.com"
  },
  mobile: {
    type: String,
    trim: true
  },
  code: {
    type: String,
    default: () => uid(16)
  },
  city: {
    type: String
  },
  region: {
    type: String
  },
  managerName: {
    type: String,
    trim: true
  },
  contactName: {
    type: String,
    trim: true
  },
  type: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  studentsCount: {
    type: Number
  },
  latlng: {
    type: [Number]
  },
  user: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})


schoolSchema.methods = {
  view (full) {
    let view = {}
    let fields = ['id', 'name', 'city', 'region', 'isVerified', 'latlng']

    if (full) {
      fields = [...fields, 'mobile', 'managerName', 'contactName',
        'type', 'studentsCount', 'latlng', 'email']
    }

    fields.forEach((field) => {
      view[field] = this[field]
    })
    return view
  }
}


schoolSchema.plugin(mongooseKeywords, {paths: ['name', 'email', 'managerName', 'contactName']})

const model = mongoose.model('School', schoolSchema)

export const schema = model.schema
export default model
