import mongoose, {Schema} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import {env} from '../../config'


const educationLevelSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

educationLevelSchema.methods = {
  view () {
    let view = {}
    let fields = ['name', 'value'];

    fields.forEach((field) => {
      view[field] = this[field]
    })
    return view
  }
}

educationLevelSchema.plugin(mongooseKeywords, {paths: ['name', 'value']})

const model = mongoose.model('EducationLevel', educationLevelSchema)

export const schema = model.schema
export default model
