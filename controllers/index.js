var User = require('../models/user');
var Paper=require('../models/paper');

exports.index=function(req, res) {
	var totalpaper=0;
	//取得所有文章数
	Paper.find({},function(err,papers){
		if(papers.length%3!=0)
			totalpaper=parseInt(papers.length/3)+1;
		else
			totalpaper=parseInt(papers.length/3);
	})
	var page=1;
	if(req.query.page)
		page=req.query.page;
	page=parseInt(page);
	Paper.find({},null,{skip:(page-1)*3,limit:3},function(err,papers){
		if(err){
			papers=[];
			return;
		}
		console.log('totalpaper='+totalpaper);
		
		res.render('combine/index',{
			title: '主页',
			user:req.session.user,
			papers:papers,
    			success: req.flash('success').toString(),
    			error: req.flash('error').toString(),
    			total:totalpaper,
    			isFirst:(page-1)==0,
    			isLast:page==totalpaper,
    			pagenow:page
		});
	});
}