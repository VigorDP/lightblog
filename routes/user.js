var User=require('../controllers/user');
var Paper=require('../controllers/paper');
var Upload=require('../controllers/upload.js');
var Active=require('../controllers/active.js');
var auth=require('../oAuth/github');
module.exports=function(app){
	  //登录
	  app.get('/signin', User.checkNotLogin,User.showSignin)
	  app.post('/signin',User.signin)
	  //注册
	  app.get('/signup', User.checkNotLogin,User.showSignup)
	  app.post('/signup', User.signup)
	  //退出
	  app.get('/logout', User.logout)
	  //激活账号
	  app.get('/active', Active.active)

	  //发表文章
	  app.get('/post',User.checkLogin,Paper.showPost)
	  app.post('/post',Paper.post)
	  //上传
	  app.get('/upload',User.checkLogin,Upload.showUpload)
	  app.post('/upload',Upload.handleUpload)
	  //编辑
	  app.get('/edit',User.checkLogin,Paper.edit)
	  app.post('/edit',Paper.saveEdit)
	  //删除
	  app.get('/delete',User.checkLogin,Paper.delete)
	  //提交评论
	  app.post('/comment',Paper.comment)
	  //转载文章
	  app.get('/reprint',User.checkLogin,Paper.reprint)
	  //获取用户页面
	  app.get('/user',User.checkLogin,User.getUser)
	  //获取文章页面
	  app.get('/paper',User.checkLogin,Paper.getPaper)
	  //第三方登录
	  app.get('/auth/github',auth.authenticate('github', { scope: [ 'user:email' ] }),
		  function(req, res){
		    // The request will be redirected to GitHub for authentication, so this
		    // function will not be called.
		  }
	);

	app.get('/auth/github/callback',auth.authenticate('github', { failureRedirect: '/signin' }),
		  function(req, res) {
		  	console.log('haha')
		    req.session.user=req.session.passport.user;
		    res.redirect('/');
		  }
	);
	  //后台管理
	  app.get('/manage',function(req,res){
	  	res.render('combine/manage',{
	  		user:null,
	  		title:'这是后台',
	  		success:'后台管理',
	  		error:null
	  	});
	  })
	  //登录权限->管理权限
	  app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.userlist)
	  function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()){
			req.session.user=req.session.passport.user;
			return res.redirect('/');
		}
		next();
	  }
}