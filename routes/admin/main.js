const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
const ejs = require('ejs');

const client = mysql.createConnection({
	host: 'localhost',
	user: 'Thurs_1team',
	port: 3306,
	password: 't1t13579',
	database: 'Thurs_1team'
});

router.get('/', (req, res) => {
	console.log("Get Method : Main");
	fs.readFile('views/main.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not found..");
		}else{
			let islogin = false;
			
			if(req.session.adid!=null){
				islogin = true;
			}

			res.status(200).send(ejs.render(data, {
				islogin:islogin
			}));
		}
	});
});

module.exports = router;

