const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const url = require('url');

const client = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'Thurs_1team',
        password: 't1t13579',
        database: 'Thurs_1team'
});


router.get('/', (req, res) => {
	res.send('login');
});

// 계정 첫 로그인 유무 및 제재로 인한 서비스 이용 불가 확인
router.get('/checkuid', (req, res) => {
	let uid = req.query.uid;
	console.log("check UID : " + uid);
	let sql = "SELECT UID, UISAPP, UNICKNAME FROM USER WHERE UID="+uid;
	client.query(sql, (err, results)=>{
		if(err){
			console.log("DB SELECT ERR, CHECK UID !");
			res.status(500).send(false);
		}else{
			if(results==null){
				// 첫 로그인
				res.status(200).send('2');
			}else{
				if(results[0].UISAPP==1){
					//계정 이용 가능, 기존 닉네임 전송
					res.status(200).send('1 / '+results[0].UNICKNAME);
				}else{
					//계정 이용 불가능
					res.status(200).send('0');
				}
			}
		}
	});
});

// 계정 첫 이용시 자동 회원가입 진행
router.post('/create', (req, res) => {

	console.log(req.body);;
	let json = JSON.parse(JSON.stringify(req.body));
	console.log("UID : " + json.uid + " / UNAME : " + json.uname + " / UEMAIL : " + json.uemail);
	client.query("INSERT INTO USER (UID, UNAME, UEMAIL, UCREATEDATE, UMODIFYDATE, UISAPP) VALUES (?,?,?,?,?,?)", [json.uid, json.uname, json.uemail, formatted, formatted, 1], (err)=>{
	if(err){
		res.status(500).send("None");
	}else{
		res.status(200).send("true");
	}
	});
});

module.exports = router;
