var User=require('../models/user.js');
exports.active=function(req,res){
	var username=req.query.username;
	User.findOneAndUpdate({
		name:username
	},{active:true},{new:true},function(err,user){
		if(err){
			return;
		}
		// console.log(paper)
		if(user){
			req.flash('success','激活成功！');
			res.redirect('/signin');
		}
		else{
			req.flash('error','用户名不存在！');
			res.redirect('/signup');
		}
	})
}