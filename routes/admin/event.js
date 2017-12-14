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

router.use(bodyParser.urlencoded({
	extended: false
}));

router.get('/', (req, res) => {
	console.log("Get Method : Event");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	fs.readFile('views/event.ejs', 'utf8', (err, data) => {
		if(err)	{
			res.status(404).send("File is Not Found..");
		}else{
			res.status(200).send(ejs.render(data));
		}
	});
	}
});

router.post('/', (req, res) => {
	console.log("Post Method : Event");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	let adid = req.session.adid;
	var ename = req.body.ename;
	var eprofit = req.body.eprofit;
	var ewhere = req.body.ewhere;
	var edeadlinedate = req.body.edeadlinedate;
	var enums = req.body.enums;
	var ecordination = req.body.ecordination;
	var ecreatedate = new Date();
	var egpsx = req.body.lng;
	var egpsy = req.body.lat;
	client.query('INSERT INTO EVENT (ADID, ENAME, ECREATEDATE, EDEADLINEDATE, ECORDINATION, EWHERE, EGPSX, EGPSY, ENUM, EPROFIT) VALUES(?,?,?,?,?,?,?,?,?,?)',[adid, ename, ecreatedate, edeadlinedate, ecordination, ewhere, egpsx, egpsy, enums, eprofit], (err) => { if(err) {

		res.status(500).send("DB ERROR");
		console.log(err);
	}else{
		console.log("성공");
		res.redirect("/admin/eventlist");	
	}
	});
	}	
});
module.exports = router;
