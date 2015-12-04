

exports.showUpload=function(req,res){
	res.render('combine/upload',{
		title:'上传页面',
		user: req.session.user,
	           success: req.flash('success').toString(),
	           error: req.flash('error').toString()
	});
}
exports.handleUpload=function(req,res){
	req.flash('success', '文件上传成功!');
  	res.redirect('/');
}