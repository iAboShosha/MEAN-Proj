import mongoose, {Schema} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import {uid} from 'rand-token'

const regionSchema = new Schema({
  region_id: {
    type: Number
  },
  name: {
    ar: {
      type: String,
      trim: true
    },
    en: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

regionSchema.methods = {
  view () {
    let view = {};
    let fields = ['region_id', 'name'];
    fields.forEach((field) => {
      view[field] = this[field]
    });
    return view
  }
};

const model = mongoose.model('Region', regionSchema)

export const schema = model.schema
export default model
