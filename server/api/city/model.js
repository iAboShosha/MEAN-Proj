import mongoose, {Schema} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import {uid} from 'rand-token'

const citySchema = new Schema({
  city_id:{
    type: Number
  },
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

citySchema.methods = {
  view () {
    let view = {};
    let fields = ['city_id', 'region_id', 'name'];
    fields.forEach((field) => {
      view[field] = this[field]
    });
    return view
  }
};

const model = mongoose.model('City', citySchema)

export const schema = model.schema
export default model
