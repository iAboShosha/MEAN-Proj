import mongoose, {Schema} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import {uid} from 'rand-token'

const ireadLegacySchema = new Schema({
    email: {
      type: String,
      trim: true
    },
    schoolLevel: {
      type: String
    },
    schoolName: {
      type: String
    },
    UniversityName: {
      type: String
    },
    bookName: {
      type: String
    },
    bookAuthor: {
      type: String
    },
    bookSummary: {
      type: String
    },
    whyThisBook: {
      type: String
    },
    twitAboutBook: {
      type: String
    },
    whyReading: {
      type: String
    },
    storyWithReading: {
      type: String
    },
    year: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

ireadLegacySchema.methods = {
  view () {
    let view = {};
    let fields = ['id', 'email',
      'schoolLevel', 'schoolName', 'UniversityName',
      'bookName', 'bookAuthor', 'bookSummary', 'whyThisBook', 'twitAboutBook', 'whyReading', 'storyWithReading',
      'year'];
    fields.forEach((field) => {
      view[field] = this[field]
    });
    return this
  }
};

ireadLegacySchema.plugin(mongooseKeywords, {paths: ['email', 'bookName']})

const model = mongoose.model('IReadLegacy', ireadLegacySchema)

export const schema = model.schema
export default model
