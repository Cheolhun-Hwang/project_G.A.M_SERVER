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
	console.log("Get Method : Eventlist");
	if(req.session.adid==null){
		res.status(300).redirect("/admin/login");
	}else{
	fs.readFile('views/eventlist.ejs', 'utf8', (err, data) => {
		if(err) {
			res.status(404).send("File is Not Found..");
		}else{
			client.query('SELECT * FROM EVENT;', (error,results)=>{
				if(error){console.log("DB Error..!");}
				else{
					console.log(results);
					res.send(ejs.render(data, {
						node:results
					}));
				}
			});
		}
	});
	}
});

router.post('/delete', (req,res) => {
    console.log("Event Delete post");
    let eid = req.body.hidden_eid;
    console.log("EID : " + eid);
		client.query("DELETE FROM EVENT WHERE EID="+eid, (err)=>{
			if(err){
				res.status(500).send("DB DELETE EID ERROR : " + err);
			}else{
				console.log("eid " + eid + " DELETE COMPLETE!!");
				res.status(200).redirect("/admin/eventlist");
			}
		});
});
module.exports = router;
