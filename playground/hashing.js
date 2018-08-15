const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

var password = 'inha707';

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	});
});

// var hashedPassword = '$2a$10$eD5qw.FMMjKXJpcmi1RhCuFOJ3ABIN9M4UzyNZlPiVBIHq9bmmeKS';
// bcrypt.compare(password, hashedPassword, (err, res) => {
// 	console.log(res);
// });