const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
	console.log();
	req.session.user = null;
	console.log('退出成功');
	req.flash('success','退出成功');
	res.redirect('/posts');
});

module.exports = router;