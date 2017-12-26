const express = require('express');
const router = express.Router();

const path = require('path');
const sha1 = require('sha1');

const UserModel= require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin;


// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
	res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
	const name = req.fields.name;
	const gender = req.fields.gender;
	const bio = req.fields.bio;
	const avatar = req.files.avatar.path.split(path.sep).pop();
	let password = req.fields.password;
	const repassword = req.fields.repassword;

	try {
		if (!(name.length >= 1 && name.length <= 10)) {
			throw new Error('名字请限制在 1-10 个字符');
		}
		if (['m', 'f', 'x'].indexOf(gender) === -1) {
			throw new Error('性别只能是 m、f 或 x');
		}
		if (!(bio.length >= 1 && bio.length <= 30)) {
			throw new Error('个人简介请限制在 1-30 个字符');
		}
		if (password.length < 6) {
			throw new Error('密码至少 6 个字符');
		}
		if (password !== repassword) {
			throw new Error('两次输入密码不一致');
		}
	}
	catch(e) {
		console.log(e);
		//fs.unlink(req.files.avatar.path);
		req.flash('error', e.message);
		return res.redirect('/signup');

	}
//密码加密
	password = sha1(password);
//待写入数据库的用户信息
	let user = {
		name: name,
		password: password,
		gender: gender,
		bio: bio,
		avatar: avatar
	};
//用户信息写入信息库
	UserModel.create(user)
		.then((result) => {
			user = result.ops[0];
			delete user.password;
			req.flash('success','注册成功');
			res.redirect('/posts');
		}).catch((e)=> {
			//fs.unlink(req.files.avatar.path);
		// 用户名被占用则跳回注册页，而不是错误页
		console.log('shujukerr')
		if (e.message.match('duplicate key')) {
			req.flash('error', '用户名已被占用')
			return res.redirect('/signup');
		}
		next(e);
		})

});

module.exports = router;