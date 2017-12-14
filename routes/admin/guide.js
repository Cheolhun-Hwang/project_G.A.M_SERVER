const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
var multer = require('multer');

const client = mysql.createConnection({
	host: 'localhost',
	user: 'Thurs_1team',
	port: 3306,
	password: 't1t13579',
	database: 'Thurs_1team'
});

var guidadd = {
	row:"",
	spot: "",
	gpsx: "",
	gpsy: "",
	date:"",
	context: "",
	images: [],
	audio: ""
}

function guidObjetcinit(){
	guidadd.row = "";
	guidadd.spot = "";
	guidadd.gpsx = "";
	guidadd.gpsy = "";
	guidadd.date="";
	guidadd.context="";
	guidadd.images = [];
	guidadd.audio = "";
}


var Storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "public/images/guide/"+guidadd.row);
	},
	filename: function(req, file, callback) {
		guidadd.images.push((guidadd.images.length+1)+".jpg");
		callback(null, guidadd.images.length+".jpg");
	}
});

var Storage_A = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, "public/audio/");
	},
	filename: function(req, file, callback) {
		guidadd.audio = file.originalname;
		callback(null, file.originalname);
	}
});

var upload = multer({
	storage: Storage
}).any(); //Field name and max count

var upload_I = multer({
	storage: Storage
}).array("gimages", 100); //Field name and max count

var upload_A = multer({
	storage: Storage_A
}).single("audiofile"); //Field name and max count


router.use('/', (req, res, next)=>{
	console.log('CONEXT GUIDE PAGE');
	next();
});

router.get('/add', (req, res) => {
	console.log("GUIDE ADD GET");
	fs.readFile('views/gregist.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			res.status(200).send(ejs.render(data));
		}
	});
});

router.post('/add', (req, res) => {

	guidObjetcinit();

	console.log("GUIDE ADD POST");
	console.log(req.body);
	let spot = req.body.spot;
	let gps = req.body.gps;

	let gpsxy = gps.toString().split(" / ");
	let context = req.body.context;
	let spots = spot.toString().split(" / ");

	console.log(spots[1] + " / " + gpsxy[0] + " / " + gpsxy[1]);
	
	guidadd.context = context;
	guidadd.gpsx = gpsxy[1];
	guidadd.gpsy = gpsxy[0];
	guidadd.spot = spots[1];

	res.status(200).redirect("/admin/guide/add/files");

});

router.get('/add/files', (req, res) => {
	console.log("GUIDE ADD GET");
	fs.readFile('views/gregist2.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			res.status(200).send(ejs.render(data));
		}
	});
});


router.post('/add/files', (req, res) => {
	console.log("GUIDE ADD POST");
	client.query("SELECT GID FROM GUIDE ORDER BY GID DESC LIMIT 1", (err, row)=>{
		if(err){
			res.status(500).send("GET DB GUIDE ROW ERROR");
		}else{
			guidadd.row = row[0].GID+1;
			console.log("row number : " + guidadd.row);

			let dir = "public/images/guide/"+guidadd.row;

			if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}

			upload_I(req, res, function(err){
				if(err){
					res.status(500).send("image ADD FILE ERROR");
				}else{
					console.log(guidadd.images.toString());
					res.status(200).redirect("/admin/guide/add/complete");
				}
			});
		}
	});
});

router.get('/add/complete', (req, res) => {
	console.log("GUIDE ADD GET");
	fs.readFile('views/gregist3.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			res.status(200).send(ejs.render(data));
		}
	});
});


router.post('/add/complete', (req, res) => {
	console.log("GUIDE ADD POST");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	let adid = req.session.adid;
	let date = new Date().toISOString().substring(0, 10);
	let time = new Date().toISOString().substring(11, 16);
	let datetime =date+"-"+time;
	guidadd.date = datetime;

	upload_A(req, res, function(err){
		if(err){
			res.status(500).send("image ADD FILE ERROR");
		}else{
			console.log(guidadd.audio);
			console.log(guidadd.row +" / "+ guidadd.context +" / "+ guidadd.images.length);
			client.query("INSERT INTO GUIDE (GID, ADID, GWHERE, GCREATEDATE, GMODIFYDATE, GGPSY, GGPSX, GAUDIO, GPHOTOURL) VALUES(?, ?, ?, ?,?,?, ?, ?, ?)",
						[guidadd.row, adid, guidadd.spot, guidadd.date, guidadd.date, guidadd.gpsy, guidadd.gpsx, "public/audio/"+guidadd.audio, "public/images/guide/"+guidadd.row+"/"+guidadd.images[0]],
						(err)=>{
								if(err){
									res.status(500).send("LAST GUIDE ADD ERROR");
								}else{
									client.query("SELECT GID FROM GUIDE ORDER BY GID DESC LIMIT 1", (err, gids)=>{
										if(err){
											res.status(500).send("GET DB GUIDE ROW ERROR");
										}else{
											client.query("INSERT INTO DETAILGUIDE (GID, GCONTEXT, GPHOTOURLS) VALUES(?, ?, ?)",
											[gids[0].GID, guidadd.context, guidadd.images.length],
											(err)=>{
												if(err){
													res.status(500).send("LAST DGUIDE ADD ERROR : \n" + err);
												}else{
													res.status(200).redirect("/admin/guide");
												}
											});
										}
									});

									
								}
			});
		}
	});
	}
});

router.post('/delete', (req, res) => {
	console.log("GUIDE DELETE");
	let gid = req.query.gid;
	console.log("GID : " + gid);
	client.query("DELETE FROM DETAILGUIDE WHERE GID="+gid, (err)=>{
		if(err){
			res.status(500).send("DB DELETE DGID ERROR : " + err);
		}else{
			client.query("delete from GUIDE where GID="+gid, (err)=>{
				if(err){
					res.status(500).send("DB DELETE DGID ERROR : " + err);
				}else{
					console.log("gid " + gid +" DELETE COMPLETE!!");
					res.status(200).redirect("/admin/guide");
				}
			});
		}
	});
});

router.get('/', (req, res) => {
	console.log("Get Method : guide");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	fs.readFile('views/guide.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			client.query('SELECT GUIDE.GID, GWHERE, GCONTEXT, GMODIFYDATE, GAUDIO, GPHOTOURLS, GPHOTOURL FROM GUIDE, DETAILGUIDE WHERE GUIDE.GID = DETAILGUIDE.GID', (error, results) => {
				if(error) {console.log("DB Error..!");}
				else{
					console.log(results);
					res.send(ejs.render(data, {
						glist:results
					}));
				}
			});
		}
	});
	}
});

	
module.exports = router;
