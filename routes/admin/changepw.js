const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const client = mysql.createConnection({
	host: 'localhost',
	user: 'Thurs_1team',
	port: 3306,
	password: 't1t13579',
	database: 'Thurs_1team'
});

router.get('/', (req, res) => {
	console.log("Get Method : changepw");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	fs.readFile('views/changepw.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			res.status(200).send(ejs.render(data));
		}
	});
	}
});

router.post('/',(req,res) => {
	console.log("Post Method : changepw");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	let adid = req.session.adid;
	var pass = req.body.pass;
	client.query('UPDATE ADMIN SET ADPWD = ? WHERE ADID = '+adid,[pass],function(err,result){
		if(err) throw err;
			console.log("비밀번호가"+pass+"로 변경되었습니다");
	});
	
	console.log("Password is changed as : "+pass);
	res.redirect('/admin/main');
	}
});
	

module.exports = router;
