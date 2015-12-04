var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name:{
    unique:true,
    type:String,
    required:true
  },
  active:{
    type:Boolean,
    default:false
  },
  password:String,
  age:Number,
  //权限
  email:String,
  head:String,
  role:{
    type:Number,
    default:1
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});
UserSchema.pre('save', function(next) {
  if (this.isNew) {
    // console.log(this.isNew)
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});

//实例方法
UserSchema.methods = {
  comparePassword: function(_password, cb) {
    var b=_password == this.password
    cb(null,b);
  }
}

//静态方法
UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  }
};

var User = mongoose.model('User', UserSchema);
module.exports = User;