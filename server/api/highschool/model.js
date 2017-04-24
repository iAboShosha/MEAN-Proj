import mongoose, {Schema} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import {uid} from 'rand-token'

const highschoolSchema = new Schema({
  personalInfo: {
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    nationalId: {
      type: String,
      trim: true,
      required: true
    },
    gender: {
      type: Number,
      enum: [0, 1],
      default: 0,
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    city: {
      type: String,
      trim: true,
      required: true
    },
    mobile: {
      type: String,
      trim: true,
      required: true
    },
    mobileOther: {
      type: String,
      trim: true
    },
    school: {
      type: String,
      trim: true,
      required: true
    },
    mobileParent: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,

      trim: true,
      lowercase: true
    },
    twitter: {
      type: String,
      trim: true
    },
    nearedCity: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
      required: true
    },
    knowContest: {
      type: [Number],
      enum: [0, 1],
      required: true
    }
  },
  book: {
    name: {
      type: String,
      trim: true
    },
    author: {
      type: String,
      trim: true
    },
    review: {
      type: String
    },
    reason: {
      type: String
    },
    twit: {
      type: String
    }
  },
  reading: {
    story: {
      type: String
    },
    favorites: {
      type: String
    },
    blog: {
      type: String,
      match: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/
    },
    readsSite: {
      type: String,
      match: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/
    },
    readsReview: {
      type: String,
      match: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/
    }
  },
  files: {
    youTubeVideo: {
      type: String,
      match: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
    }
  }
}, {
  timestamps: true
});

highschoolSchema.methods = {
  view () {
    let view = {};
    let fields = ['id', 'personalInfo', 'book', 'reading', 'files'];
    fields.forEach((field) => {
      view[field] = this[field]
    });
    return view
  }
};

//highschoolSchema.plugin(mongooseKeywords, {paths: ['email', 'username']})

const model = mongoose.model('Highschool', highschoolSchema)

export const schema = model.schema
export default model
