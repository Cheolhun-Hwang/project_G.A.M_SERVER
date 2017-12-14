const express = require('express');
const mysql = require('mysql');
const router = express();

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
	console.log("Send Notice");
	client.query("SELECT NID, NTITLE, NMODIFYDATE, NCONTEXT, ADNAME FROM NOTIFY, ADMIN WHERE ADMIN.ADID=NOTIFY.ADID", (err, result)=>{
		if(err){
			console.log("DB FAIL");
		}else{
				
			var array = new Array();
			for(var i =0;i<result.length;i++ ){
				let data = new Object();
				data.NID=result[i].NID;
				data.NTITLE=result[i].NTITLE;
				data.NMODIFY=result[i].NMODIFYDATE;
				data.NCONTEXT=result[i].NCONTEXT;
				data.ADNAME=result[i].ADNAME;
				array.push(data);
			}

			var finalObj = new Object();
			finalObj.notice=array;


			res.status(200).send(JSON.stringify(finalObj));
		}
	});
});




module.exports = router;
