# lightblog(LB)
Node+Express+MongoDB+EJS实现的轻博客系统
# 访问地址
https://mylightblog.herokuapp.com
## 项目介绍：
### 前端技术
`````
1 LB前台采用EJS模板进行开发(将来打算改用Angular)。
2 LB目前所有前端JS代码全部采用模块化编写，使用Requirejs驱动（将来可能考虑采用国产Seajs）。
3 LB使用mocha+chai来编写js单元测试。
4 LB使用强大的gulp对项目进行构建工作。
5 LB全部代码托管在GitHub上。
`````
### 后端技术
`````
1 LB后台采用Nodejs+express来提供Restful API.
2 数据库采用 Mongodb，通过Mongoose驱动。
3 服务器部署在heroku，数据库使用mongolab。
`````
# 功能介绍
```
1 实现普通登录和第三方登录
2 实现注册时需要邮箱激活
3 已登录用户可以发表文章、修改文章、转载文章，还可评论文章
4 未登录用户试图浏览文章时会被强制登录
5 已登录用户不能访问注册页和登录页，未登录用户不能访问发表文章页
6 ...
```
