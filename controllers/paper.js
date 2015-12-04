var Paper=require('../models/paper');
var Comment=require('../models/comment');
exports.post=function(req,res){
	var date=new Date();
	var _paper={
		title:req.body.title,
		author:req.session.user.name,
		content:req.body.content,
		time:date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
	}
	Paper.findOne({
		title:_paper.title,
		author:_paper.author
	},function(err,paper){
		if(err){
			return;
		}
		if(!paper){
			var paper=new Paper(_paper);
			paper.save(function(err){
				if(err){
					req.flash('error','文章存储失败！');
					res.redirect('/post');
				}
				req.flash('success','发布成功！');
				res.redirect('/')
			})
		}
	})
}
exports.showPost=function(req,res){
	res.render('combine/post',{
	  	title:'发表页面',
  		user:req.session.user,
	           success: req.flash('success').toString(),
	           error: req.flash('error').toString()
	 })
}
exports.edit=function(req,res){
	Paper.findOne({
		author:req.query.author,
		title:req.query.title
	},function(err,paper){
		if(err){
			paper=[];
			return;
		}
		res.render('combine/edit', { 
			title: '编辑页面',
			user:req.session.user,
			paper:paper,
    			success: req.flash('success').toString(),
    			error: req.flash('error').toString()
		});
	});
}
exports.saveEdit=function(req,res){
	// console.log(req.body.title,req.session.user.name)
	Paper.findOneAndUpdate({
		title:req.body.title,
		author:req.session.user.name
	},{content:req.body.content},{new:true},function(err,paper){
		if(err){
			return;
		}
		// console.log(paper)
		if(paper){
			req.flash('success','修改成功！');
			res.redirect('/')
		}
	})
}
exports.delete=function(req,res){
	// console.log(req.body.title,req.session.user.name)
	Paper.findOneAndRemove({
		title:req.query.title,
		author:req.query.author
	},function(err,paper){
		if(err){
			return;
		}
		// console.log(paper)
		if(paper){
			req.flash('success','删除成功！');
			res.redirect('/')
		}
	})
}
exports.getPaper=function(req,res){
	var user=req.session.user;
	Paper.findOne({
		author:req.query.author,
		title:req.query.title
	},function(err,paper){
		if(err){
			console.log(err)
		}
		paper.update({$inc:{pv:1}}).exec(function(err){
			if(err)
				console.log(err);
		})
		//解析 markdown 为 html
		// paper.content = markdown.toHTML(paper.content);
		// console.log(req.session.user)
		res.render('combine/paperdetail',{ 
			title: '文章页面',
			user: user,
			paper:paper,
    			success: req.flash('success').toString(),
    			error: req.flash('error').toString()
		});
	});
}
exports.comment=function(req,res){
	var date=new Date();
	var _comment={
		name:req.body.name,
		title:req.body.title,
		time:date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		content:req.body.content
	}
	var comment=new Comment(_comment);
	Paper.findOne({
		title:req.body.title,
		author:req.body.author
	},function(err,paper){
		if(err){
			return;
		}
		paper.update({$push:{comments:comment}},function(err,paper){})
		// console.log(paper)
		if(paper){
			req.flash('success','评论成功！');
			res.redirect('back');
		}
	    }
	)
}
exports.reprint=function(req,res){
	var title=req.query.title,
	      author=req.query.author,
	      currentUser=req.session.user;
	var reprint_to={
		name:currentUser.name
	}
	Paper.findOne({
		title:title,
		author:author
	},function(err,paper){
		if(err)
			return;
		paper.update({$push:{reprint_to:reprint_to}},function(err,paper){});
		// console.log(paper)
		var _paper={
			title:paper.title,
			type:'',
			content:paper.content,
			time:paper.time,
			type:false,
			author:currentUser.name,
			comments:[],
			pv:0,
			reprint_to:[],
			reprint_from:[{name:author}]
		};
		Paper.findOne({
			title:_paper.title,
			author:_paper.author
		},function(err,paper){
			if(err){
				console.log(err)
				return;
			}

			if(!paper){
				var re_paper=new Paper(_paper);
				// console.log(re_paper)
				re_paper.save(function(err){
					if (err) {
						console.log(err)
						return;
					}
					req.flash('success','转载成功！');
					res.redirect('/')
				})
			}
			else{
				req.flash('error','已转载过该文章！');
				res.redirect('back')
			}
		})
	})

}