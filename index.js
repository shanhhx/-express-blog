const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package.json');
const ejs = require('ejs');

const app = express();


//设置模版目录
app.set('views',path.join(__dirname,'views'));

//设置模版引擎为ejs

app.set('view engine','ejs');
//设置静态文件目录
app.use(express.static(path.join(__dirname,'public')));




//session 中间件
app.use(session({
  	name:config.session.key,
	secret:config.session.secret,
	resava:true,
	saveUninitialized:false,
	cookie: {
		maxAge:config.session.maxAge
	},
	store: new MongoStore({
		url:config.mongodb
	})
}));
app.use(flash());
app.use(require('express-formidable')({
	uploadDir: path.join(__dirname, 'public/image'), // 上传文件目录
	keepExtensions: true// 保留后缀
}));


app.locals.blog = {
	title:pkg.name,
	description:pkg.description
};
app.use((req,res,next)=>{
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});
routes(app);
app.listen(config.port,function () {
	console.log(`${pkg.name}listening on port ${config.port}`);

});