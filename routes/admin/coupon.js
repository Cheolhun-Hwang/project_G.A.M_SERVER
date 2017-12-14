const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');
var multer = require('multer');

const client = mysql.createConnection({
	host: 'localhost',
	user: 'Thurs_1team',
	port: 3306,
	password: 't1t13579',
	database: 'Thurs_1team'
});

var showAddImage="";

var couponadd = {
	eid:"",
	date:"",
	images: []
}

function couponObjetcinit(){
	couponadd.eid = "";
	couponadd.date="";
	couponadd.images = [];
}

var Storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "public/images/coupon");
	},
	filename: function(req, file, callback) {
		showAddImage = file.originalname;
		callback(null, file.originalname);
	}
});

var Storages = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "public/images/coupon");
	},
	filename: function(req, file, callback) {
		couponadd.images.push(file.originalname);
		callback(null, file.originalname);
	}
});

var upload = multer({
	storage: Storage
}).single("cimages"); //Field name and max count

var upload_I = multer({
	storage: Storages
}).array("cimages", 100); //Field name and max count

router.get('/', (req, res) => {
	console.log("Get Method : Coupon");
	if(req.session.adid == null){
		res.status(300).redirect('/admin/login');
	}else{
	fs.readFile('views/coupon.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			
			client.query("SELECT EID, ENAME FROM EVENT", (err, elist)=>{
				if(err){
					console.log("DB Error..! : " + err);
				}else{
					client.query('SELECT EVENT.EID as EID, ADNAME, ENAME, CCREATEDATE, count(CPHOTOURL) as COUNT FROM COUPON, EVENT, ADMIN WHERE EVENT.EID = COUPON.EID AND ADMIN.ADID = COUPON.ADID group by ENAME order by CCREATEDATE ASC', (error, results) => {
						if(error){console.log("DB Error..! : " + err);}
						else{
							console.log(results);
							res.send(ejs.render(data, {
								node:results,
								elist:elist
							}));
						}
					});
				}
			});
		}
	});
	}
});

router.get('/show', (req, res) => {
	console.log("Get Method : Coupon");
	let eid = req.query.eid;
	fs.readFile('views/couponlist.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			client.query('SELECT CID, EVENT.EID as EID, ENAME, CCREATEDATE, CPHOTOURL, CISUSE FROM COUPON, EVENT, ADMIN WHERE EVENT.EID = COUPON.EID AND EVENT.EID = '+eid, (error, results) => {
				if(error){
					console.log("DB Error..!");
				}else{
					console.log(results);
					res.send(ejs.render(data, {
						node:results
					}));
				}
			});
		}
	});
});

router.get('/add', (req, res)=>{
	console.log("COUPON ADD GET");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	let eid = req.query.eid;
	couponadd.eid = eid;
	fs.readFile('views/couponadd.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			res.send(ejs.render(data, {
		}));
		}
	});
	}
});

router.post('/add', (req, res)=>{
	couponObjetcinit()
	console.log("COUPON ADD POST");
	let eid = req.query.eid;
	res.status(200).redirect("/admin/coupon/add?eid="+eid);
});

router.post('/add/files', (req, res) => {
	console.log("GUIDE ADD POST");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	let adid = req.session.adid;
	let date = new Date().toISOString().substring(0, 10);
	let time = new Date().toISOString().substring(11, 16);
	let datetime =date+"-"+time;
	couponadd.date = datetime;
	
	upload_I(req, res, function(err){
		if(err){
			res.status(500).send("image ADD FILE ERROR");
		}else{
			console.log(couponadd.images.toString());
			console.log(couponadd.eid);

			for(var i = 0;i<couponadd.images.length;i++){
				client.query("INSERT INTO COUPON (ADID, EID, CPHOTOURL, CCREATEDATE, CISUSE, CGROUP) VALUES(?,?,?,?,?,?)",
							[adid, couponadd.eid, "/images/coupon/"+couponadd.images[i], couponadd.date, 0, "0"],
							(err)=>{
								if(err){
									res.status(500).send("COUPON ADD ERROR : " + err);
								}
							} );
			}

			res.status(200).redirect("/admin/coupon");
		}
	});
	}
});

router.post('/show/add', (req, res) => {
	console.log("COUPON SHOW ADD POST");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	let adid = req.session.adid;
	let eid = req.query.eid;
	let dir = "public/images/coupon";

	let date = new Date().toISOString().substring(0, 10);
	let time = new Date().toISOString().substring(11, 16);
	let datetime =date+"-"+time;

	upload(req, res, function(err){
		if(err){
			res.status(500).send("image ADD FILE ERROR");
		}else{
			console.log(showAddImage);
			client.query("INSERT INTO COUPON (ADID, EID, CPHOTOURL, CCREATEDATE, CISUSE, CGROUP) VALUES(?, ?,?,?, ?, ?)",
						[adid, eid, "/images/coupon/"+showAddImage, datetime, 0, '0'], (err)=>{
							if(err){
								res.status(500).send("DB COUPON LIST ADD ERROR : " + err);
							}else{
								res.status(200).redirect("/admin/coupon/show?eid="+eid);
							}
						});
		}
	});
	}
});

router.post('/show/delete', (req, res) => {
	console.log("COUPON ADD POST");
	let cid = req.query.cid;
	let eid = req.query.eid;

	client.query("DELETE FROM COUPON WHERE CID="+cid, (err)=>{
		if(err){
			res.status(500).send("DB COUPON LIST DELETE ERROR : " + err);
		}else{
			res.status(200).redirect("/admin/coupon/show?eid="+eid);
		}
	});
});

router.post('/delete', (req, res) => {
	console.log("COUPON DELETE POST");
	let eid = req.query.eid;

	client.query("DELETE FROM COUPON WHERE COUPON.EID="+eid, (err)=>{
		if(err){
			res.status(500).send("DB COUPON LIST DELETE ERROR : " + err);
		}else{
			res.status(200).redirect("/admin/coupon");
		}
	});
});

module.exports = router;
