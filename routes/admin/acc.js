const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const fs = require("fs");
const ejs = require("ejs");
const bodyParser = require('body-parser');

const client = mysql.createConnection({
	host: 'localhost',
	user: 'Thurs_1team',
	port: 3306,
	password: 't1t13579',
	database: 'Thurs_1team'
});

router.get('/', (req, res) => {
	console.log("Get Method : Account");

	if(req.session.adid == null){
		res.status(300).redirect("/admin/login");
	}else{	
	let adid = req.session.adid;

	fs.readFile('views/acc.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not found..");
		}else{
			client.query('SELECT USER.UID as UID, UNAME, UEMAIL, UCREATEDATE as UCDATE, UMODIFYDATE as UMDATE, UISAPP, count(WWHEN) as WCT, IFNULL(UNICKNAME,"미지정") as UNICK FROM USER, WARNING WHERE USER.UID=WARNING.UID GROUP BY USER.UID', (error, results) => {
				if(error){console.log("DB Error..!");}
				else{
					res.send(ejs.render(data, {
						node:results
					}));
				}
			});
		}
	});
	}
});

router.post('/warning', (req, res)=>{
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	let adid = req.session.adid;
	let uid = req.query.uid;
	let warning = req.body.wcontext;

	let date = new Date().toISOString().substring(0, 10);
	let time = new Date().toISOString().substring(11, 16);
	let datetime =date+"-"+time;

	client.query("INSERT INTO WARNING (UID, ADID, WWHEN, WWHY) VALUES(?, ?, ?, ?)", [uid, adid, datetime, warning], (err)=>{
		if(err){
			res.status(500).send("DB WARNING ADD ERROR : " + err);
		}else{
			res.status(200).redirect("/admin/acc");
		}
	});
	}
});

router.post('/userblock', (req, res)=>{
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	let uid = req.query.uid;

	client.query("UPDATE USER SET UISAPP='0' WHERE uid="+uid, (err)=>{
		if(err){
			res.status(500).send("DB ACC BLOCK ERROR : " + err);
		}else{
			res.status(200).redirect("/admin/acc");
		}
	});
	}
});

router.post('/userRelease', (req, res)=>{
	if(req.session.adid == null){
		res.status(300).redirect("/admin/login");
	}else{
	let uid = req.query.uid;
	
		client.query("UPDATE USER SET UISAPP='1' WHERE uid="+uid, (err)=>{
			if(err){
				res.status(500).send("DB ACC BLOCK ERROR : " + err);
			}else{
				res.status(200).redirect("/admin/acc");
			}
		});
	}
});

module.exports = router;
