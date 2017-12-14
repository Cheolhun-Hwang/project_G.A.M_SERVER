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
	res.send('set');
});


router.get('/warning', (req, res) => {
	let uid = req.query.uid;
        console.log("Warning : " + uid);
        client.query("SELECT WWHEN, WWHY FROM WARNING WHERE UID="+uid, (err, result)=>{
                if(err){
                        console.log("DB SELECT ERR, WARNING UID !");
                        res.status(500).send("None");
                }else{
			var array = new Array();
                        for(var i =0;i<result.length;i++ ){
                                let data = new Object();
                                data.WWHEN=result[i].WWHEN;
                                data.WWHY=result[i].WWHY;
                                array.push(data);
                        }

                        var finalObj = new Object();
                        finalObj.warning=array;


                        res.status(200).send(JSON.stringify(finalObj));
                }
        });

});

router.get('/joinlist', (req, res) => {
	let uid = req.query.uid;
        console.log("Send Coupon");
        client.query("SELECT ENAME, EPROFIT, ENUM, ECORDINATION, EDEADLINEDATE, JRESULT FROM JOINEVENT, EVENT WHERE JOINEVENT.UID = "+uid+" AND JOINEVENT.EID = EVENT.EID", (err, result)=>{
                if(err){
                        console.log("DB FAIL");
                }else{

                        var array = new Array();
                        for(var i =0;i<result.length;i++ ){
                                let data = new Object();
                                data.ENAME=result[i].ENAME;
                                data.EPROFIT=result[i].EPROFIT;
                                data.ENUM=result[i].ENUM;
                                data.ECORDINATION=result[i].ECORDINATION;                                
				data.EDEADLINE=result[i].EDEADLINEDATE;
                                data.JRESULT = result[i].JRESULT;
                                array.push(data);
                        }

                        var finalObj = new Object();
                        finalObj.join=array;


                        res.status(200).send(JSON.stringify(finalObj));
                }
        });

});

router.put('/nic', (req, res) => {
	console.log(req.body);;
        let json = JSON.parse(JSON.stringify(req.body));
        console.log("nick : " + json.nick);
	
	let date = new Date().toISOString().substring(0, 10);
	let time = new Date().toISOString().substring(11, 16);
	let datetime =date+"-"+time;
	console.log("Change : " + datetime);
	client.query("UPDATE USER SET UNICKNAME='"+json.nick +"' WHERE uid="+json.uid, (err)=>{
	if(err){
		res.status(500).send("DB ERROR : " + err);
	}else{
		client.query("UPDATE USER SET UMODIFYDATE='"+datetime+"' WHERE uid="+json.uid, (err)=>{
			res.status(200).send("OK");
		});
	}
} );
});

module.exports = router;
