var User = require('../models/user');
var Paper=require('../models/paper');
var crypto = require('crypto');
var service_qq=require('../services/qq-active.js');
var service_163=require('../services/163-active.js');

//页面权限控制中间件
exports.checkLogin=function(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '请先登录!'); 
    return res.redirect('/signin');//加return就不会执行后面的回调函数，此处必须加
  }
  next();
}
exports.checkNotLogin=function(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!'); 
    return res.redirect('back');//返回之前的页面
  }
  next();
}
//获取用户页面
exports.getUser=function(req,res){
	Paper.find({author:req.query.name},function(err,papers){
		if(err){
			papers=[];
			return;
		}
		//解析 markdown 为 html
		// papers.forEach(function (paper) {
		//   paper.content = markdown.toHTML(paper.content);
		// });
		res.render('combine/user',{ 
			title: '用户页面',
			user: req.session.user,
			papers:papers,
    			success: req.flash('success').toString(),
    			error: req.flash('error').toString()
		});
	});
}
// 注册
exports.showSignup = function(req, res) {
 res.render('./combine/signup', {
    title: '注册页面',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
};
//登录
exports.showSignin = function(req, res) {
 res.render('./combine/signin', {
    title: '登录页面',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
}

//用户注册
exports.signup = function(req, res) {
	// req.query
	// req.params
	var md5 = crypto.createHash('md5'),
	    email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
	    head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
	var _user = {
		name:req.body.name,
		password:req.body.password,
		age:req.body.age,
		email:req.body.email,
		head:head
	}
	var url='http://mylightblog.herokuapp.com/active?username='+_user.name;
	var options_qq={
	          from: "轻博客<1421070158@qq.com>", // 发件地址
	          to: _user.email, // 收件列表
	          subject: "账号激活", // 标题
	          html: "<b>欢迎注册轻博客系统，请点击以下链接完成注册</b><br> <a href="+url+">"+url+"</a>" // html 内容
	}
	var options_163={
	          from: "轻博客<15926339107@163.com>", // 发件地址
	          to: _user.email, // 收件列表
	          subject: "账号激活", // 标题
	          html: "<b>欢迎注册轻博客系统，请点击以下链接完成注册</b><br> <a href="+url+">"+url+"</a>" // html 内容
	}
	if(_user.email.indexOf('qq')!=-1)
		service_qq(options_qq);
	else
		service_163(options_163);
	//是不是重复增加
	User.findOne({
		name: _user.name
	}, function(err, user) {
		console.log(user)
		if (user) {
			req.flash('error', '用户已存在!');
			res.redirect('back');
		}
		var user = new User(_user);
		user.save(function(err) {
			if (err) {
				console.log(err);
				req.flash('error', '存储发生错误!');
				return;
			}
			req.flash('success', '请到注册邮箱完成账号激活!');
			res.redirect('back');
		});
	});
}
  
//用户登录
exports.signin = function(req, res) {
	var _user = {
		name:req.body.name,
		password:req.body.password
	}
	var name = _user.name;
	var password = _user.password;
	// console.log(name,password);
	User.findOne({
		name: name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		//用户不存在
		if (!user) {
			req.flash('error', '用户不存在!');
			res.redirect('/signup');
		}
		else{
			if(user.active){//激活用户
				//用户存在,验证密码
				user.comparePassword(password, function(err, isMatch) {
					if (err) {
						console.log(err);
						return;
					}
					// console.log(isMatch)
					if (isMatch) {
						//保存登陆成功会话
						req.flash('success', '登录成功！');
						req.session.user = user;
						res.redirect('/');
					} else {
						req.flash('error', '密码有误！');
						res.redirect('/signin');
					}
				});
			}else{
				req.flash('error', '账号未激活，请到注册邮箱激活');
				res.redirect('/signin');
			}
			
		}
	});
}
//退出登录
exports.logout=function(req,res){
	if(req.session.user){
		req.session.user = null;
		req.session.passport.user=null;
	  	req.flash('success', '退出成功!');
	  	res.redirect('/');//登出成功后跳转到主页
	}
	else{
		req.flash('error', '请先登录！');
		res.redirect('/signin');
	}
}
//用户列表
exports.userlist =  function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}
		res.render('userlist', {
			title: '用户列表',
			users: users
		});
	});
}
//用户权限管理
//中间件
exports.signinRequired = function(req, res) {
  var user = req.session.user;
  if (!user) {
    res.redirect('/signin');
  }
}
exports.adminRequired = function(req, res) {
  var user = req.session.user;
  console.log(222222,user);
  if (user.role <= 10) {
    return res.redirect('/signin')
  }
}