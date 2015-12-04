module.exports=function(options){
        var nodemailer = require("nodemailer");

        // 开启一个 SMTP 连接池
        var smtpTransport = nodemailer.createTransport("SMTP", {
              host: "smtp.163.com",
              auth: {
                user: "15926339107@163.com",
                pass: "erqglmrtmieetxmz"// 授权密码，不是账号密码
            }
          });
        // 设置邮件内容
        // var mailOptions = {
        //   from: "Fred Foo <1421070158@qq.com>", // 发件地址
        //   to: "1421070158@qq.com", // 收件列表
        //   subject: "Hello world", // 标题
        //   html: "<b>thanks a for visiting!</b> 世界，你好！" // html 内容
        // }

        // 发送邮件
        smtpTransport.sendMail(options, function(error, response){
          if(error){
            console.log(error);
          }else{
            console.log("Message sent: " + response.message);
          }
          smtpTransport.close(); // 如果没用，关闭连接池
        });
}
