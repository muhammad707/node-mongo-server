const mongoose = require('mongoose'); // mongoose  library
const validator = require('validator'); // input validator
const jwt = require('jsonwebtoken'); // json web token to create tokens
const _ = require('lodash'); // lodash library
const bcrypt = require('bcryptjs'); // library used to hash passwords
// UserSchema model for  authentication
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});


 // only returns id and email of user
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// creates a token and pushes and saves to user doc in db
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

//decodes token and if successfull matches all decoded values

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try { 
    decoded = jwt.verify(token,  'abc123'); //verifies token with secret value
  } catch(e) {
    return new Promise.reject(); // if error occurs returns reject promise
  }

// if no error, returns promise with user with id, token and access 
  return User.findOne({
    _id:decoded._id,
    'tokens.token': token,
    'tokens.access':'auth'
  });
};  // END OF DECODING AND FINDING CORRESPONDING USER FUNCTION

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
}

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};
// method to hash passowrd provided by user and stores to database
UserSchema.pre('save', function(next) {
    var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {  
    next();
  }
}) 
var User = mongoose.model('User', UserSchema);

module.exports = {User}
