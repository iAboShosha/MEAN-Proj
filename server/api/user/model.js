import crypto from 'crypto'
import bcrypt from 'bcrypt'
import randtoken from 'rand-token'
import mongoose, {Schema} from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import {env} from '../../config'
import {uid} from 'rand-token'

const roles = ['user', 'admin']

const userSchema = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: () => uid(32)
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    index: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  }
  , nNum: {
    type: String,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  gender: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  mobile: {
    type: String,
    trim: true
  }, mobile2: {
    type: String,
    trim: true
  },
  dob: {
    type: Date,
  },
  state: {
    type: Number
  },
  city: {
    type: String,
    trim: true
  },
  school: {
    type: Number
  },
  study_state: {
    type: String
  },
  services: {
    facebook: String,
    google: String,
    twitter: String,
    live: String
  },
  role: {
    type: String,
    enum: roles,
    default: 'user'
  },
  picture: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

userSchema.path('email').set(function (email) {
  if (!this.picture || this.picture.indexOf('https://gravatar.com') === 0) {
    const hash = crypto.createHash('md5').update(email).digest('hex')
    this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`
  }

  if (!this.username) {
    this.username = email.replace(/^(.+)@.+$/, '$1')
  }

  return email
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()

  /* istanbul ignore next */
  const rounds = env === 'test' ? 1 : 9

  bcrypt.hash(this.password, rounds).then((hash) => {
    this.password = hash
    next()
  }).catch(next)
})

userSchema.methods = {
  view (full) {
    let view = {}
    let fields = ['id', 'username', 'picture']

    if (full) {
      fields = [...fields, 'firstName', 'lastName', 'middleName', 'gender',
        'dob', 'city', 'email', 'nNum', 'mobile', 'mobile2',
        'facebookUrl', 'googleUrl', 'twitterUrl', 'instagramUrl',
        'createdAt', 'isVerified', 'role']
    }

    fields.forEach((field) => {
      view[field] = this[field]
      view['isTwitter'] = this['services'].twitter != null;
      view['isLive'] = this['services'].live != null;
      view['isFacebook'] = this['services'].facebook != null;
      view['isGoogle'] = this['services'].google != null;
    })
    console.log(this)
    return view
  },

  authenticate (password) {
    return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
  }
}

userSchema.statics = {
  roles,

  createFromService ({service, id, email, username, picture}) {
    return this.findOne({$or: [{[`services.${service}`]: id}, {email}]}).then((user) => {
      if (user) {
        user.services[service] = id
        if (username)
          user.username = username
        user.picture = picture

        return user.save()
      } else {
        const password = randtoken.generate(16);
        var hasEmail = email ? true : false;
        if (!hasEmail) email = 'none@example.com';
        return this.create({
          services: {[service]: id}, email, password, username, picture,
          verificationCode: null, isVerified: hasEmail
        })
      }
    })
  }
}

userSchema.plugin(mongooseKeywords, {paths: ['email', 'username']})

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
