var mongoose = require('mongoose');
var CommentSchema = new mongoose.Schema({
  name:{ //评论人
    // unique:true,
    type:String
  },
  title:String,//评论文章标题
  content:String,//评论内容
  time:String,//评论时间
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
CommentSchema.pre('save', function(next) {
  if (this.isNew) {
    // console.log(this.isNew)
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});
var Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;