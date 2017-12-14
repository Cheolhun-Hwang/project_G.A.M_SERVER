const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const client = mysql.createConnection({
	host:'localhost',
	user:'Thurs_1team',
	port: 3306,
	password: 't1t13579',
	database: 'Thurs_1team'
});

router.get('/', (req, res) => {
	console.log("Get Method : Notify");
	if(req.session.adid==null){
		res.status(300).redirect('/admin/login');
	}else{
	fs.readFile('views/notify.ejs','utf8',(err,data) => {
		if(err){
			res.status(404).send("File is Not Found..!");
		}else{
			client.query('SELECT * FROM NOTIFY;',(error,results)=>{
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

router.post('/',(req,res) => {
	console.log("Post Method : Notify");
	let ntitle = req.body.ntitle1; //제목
	let ncontext = req.body.ncontext1; //내용
	let nowdate = new Date();

	let date = new Date(nowdate).toISOString().substring(0, 10);
        let time = new Date(nowdate).toISOString().substring(11, 16);
        let datetime =date+"-"+time;


	client.query('INSERT INTO NOTIFY (ADID,NCREATEDATE,NMODIFYDATE,NTITLE,NCONTEXT) VALUES(?,?,?,?,?)',[1,datetime,datetime,ntitle,ncontext], (err)=>{
		if(err){
			res.status(500).send("DB ERROR");
		}else{
			res.redirect('/admin/notify');
			console.log("제목: " + ntitle + "/ 내용: "+ ncontext);
		}
	});	
});

router.post('/modify',(req,res) => {
	console.log("Post Method : Notify(Modify)");
	let ntitle = req.body.ntitle2;
	let ncontext = req.body.ncontext2;
	let nid = req.body.hidden_nid;
	let nowdate = new Date();

	let date = new Date(nowdate).toISOString().substring(0, 10);
   	let time = new Date(nowdate).toISOString().substring(11, 16);
   	let datetime =date+"-"+time;
	
	console.log(datetime);	
	
	client.query('UPDATE NOTIFY SET NTITLE = ?, NCONTEXT = ?, NCREATEDATE = ? WHERE NID = ?',[ntitle,ncontext,datetime,nid],function(err, result){
		if(err) throw err;
		console.log(result);
		console.log(nid+'번 공지사항이 수정되었습니다..!')
	});
	
	res.redirect('/admin/notify');
});

router.post('/delete',(req,res) => {
        console.log("Post Method : Notify(Delete)");
	let nid = req.body.hidden_nid;
	client.query('DELETE FROM NOTIFY WHERE NID = ?',[nid],function(err,result){
		if(err) throw err;
		console.log(result);
		console.log(nid+'번 공지사항이 삭제되었습니다..!');
	});
	res.redirect('/admin/notify');
});



module.exports = router;
