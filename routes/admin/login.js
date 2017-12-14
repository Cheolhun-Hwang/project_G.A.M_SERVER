const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const fs = require('fs');
const ejs = require("ejs");
const bodyParser = require('body-parser');



const client = mysql.createConnection({
	host:'localhost',
	user:'Thurs_1team',
	port: 3306,
	password: 't1t13579',
	database: 'Thurs_1team'
});	

router.get('/', (req, res)=>{
	console.log("Get Method : Login");
	fs.readFile('views/login.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			res.status(200).send(ejs.render(data));
		}
	});	
});

router.post('/', (req, res) => {
	console.log("Post Method : Login");
	var id = req.body.id;
	var password = req.body.password;
	
	console.log("id : " + id  + " / pw : " + password );

	client.query("SELECT ADID, ADUID, ADPWD FROM ADMIN",(err,results)=>{
	if(err){
		console.log("DB SELECT ERR, WARNING UID !");
		res.status(500).send("None");
	}else{
		if(results == null){
			res.status(200).send(0);
		}else{	
			for(var i=0; i<results.length; i++){
		
				if(results[i].ADUID == id && results[i].ADPWD == password){
					req.session.adid = results[i].ADID;
					res.redirect('/admin/main');
							
				}else{
					res.redirect('/admin/login');
				}	
			}
		
		}
	}
	});
});

router.use('/logout', (req, res)=>{
	req.session.adid = null;
	res.status(300).redirect("/admin/main");
});


module.exports = router;

