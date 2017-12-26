const User = require('../lib/mongo').User;

module.exports = {
	//注册一个新用户
	create: function create(user) {
		return User.create(user).exec();
	},
//	根据用户名获取用户信息
	getUserByname:function getUserByname(name) {
		return User
			.findOne({name:name})
			.addCreateAt()
			.exec()
	}
}