const express = require('express');
const mysql = require('mysql');
const router = express();
const fs = require('fs');

const client = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'Thurs_1team',
        password: 't1t13579',
        database: 'Thurs_1team'
});

router.get('/', (req, res) => {
	res.send("Notice RESULT");
});

router.get('/list', (req, res)=>{
	let uid = req.query.uid;
	console.log("Send Coupon");
	client.query("SELECT ENAME, CPHOTOURL, EPROFIT, EDEADLINEDATE FROM COUPON, PROFITCOUPON, EVENT, JOINEVENT WHERE PROFITCOUPON.UID = "+uid+" AND PROFITCOUPON.CID = COUPON.CID AND PROFITCOUPON.JEID = JOINEVENT.JEID AND EVENT.EID = JOINEVENT.EID;", (err, result)=>{
		if(err){
			console.log("DB FAIL");
		}else{
				
			var array = new Array();
			for(var i =0;i<result.length;i++ ){
				let data = new Object();
				data.ENAME=result[i].ENAME;
				data.EPROFIT=result[i].EPROFIT;
				data.CPHOTO=result[i].CPHOTOURL;
				data.EDEADLINE=result[i].EDEADLINEDATE;
				array.push(data);
			}

			var finalObj = new Object();
			finalObj.coupon=array;


			res.status(200).send(JSON.stringify(finalObj));
		}
	});
});

router.get('/images', (req, res)=>{
	let file = req.query.file;
	console.log('file : '+file );
	client.query("SELECT CPHOTOURL FROM COUPON WHERE CPHOTOURL Like '%"+file+"'", (err, result)=>{
		fs.exists("public"+result[0].CPHOTOURL, (exists)=>{
                if(exists){
			console.log("FILE EXIST");
                        fs.readFile("public"+result[0].CPHOTOURL, (err, data)=>{
                                if(err){
                                        res.end("File load error");
                                }else{

                                        res.end(data);
                                }
                        });
                }else{
			console.log("FILE NO")
                        res.end("file is Not exists");
                }
        });

	});
});




module.exports = router;
