import mongoose, {Schema} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import {uid} from 'rand-token'

const universitySchema = new Schema({
    userId: {
      type: String,
      trim: true,
      required: true
    },
    university: {
      type: String,
      required: true
    },
    nearedCity: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
      required: true
    },
    knowContest: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    review: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    twit: {
      type: String,
      required: true
    },
    story: {
      type: String
    },
    favorites: {
      type: String
    },
    blog: {
      type: String//,
      //match: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/
    },
    readsSite: {
      type: String//,
      //match: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/
    },
    readsReview: {
      type: String//,
      //match: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/
    },
    youTubeVideo: {
      type: String//,
      //match: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
    },
    status: {
      type: String,
      required: true,
      default: 'save'
    },
    filesName: {
      type: String
    },
    verificationCode: {
      type: String
    },
    educationLevel:{
      type: Number
    }
  },
  {
    timestamps: true
  }
);


universitySchema.methods = {
  view () {
    let view = {};
    let fields = ['id', 'userId',
      'knowContest', 'nearedCity', 'university',
      'name', 'author', 'review', 'reason', 'twit', 'story', 'favorites',
      'blog', 'readsSite', 'readsReview',
      'youTubeVideo', 'filesName', 'verificationCode'];
    fields.forEach((field) => {
      view[field] = this[field]
    });
    return this
  }
};

universitySchema.plugin(mongooseKeywords, {paths: ['name', 'university']})

const model = mongoose.model('University', universitySchema)

export const schema = model.schema
export default model
