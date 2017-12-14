const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const router = express();
var multiparty = require('multiparty');

const client = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'Thurs_1team',
	password: 't1t13579',
	database: 'Thurs_1team'
});

function getmeter(lat1, lon1, lat2, lon2) {
  delta_lon = deg2rad(lon2) - deg2rad(lon1);

  distance = Math.acos(Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
  Math.cos(delta_lon)) * 3963.189; //마일

  gap = parseInt(distance * 1609.344);
  return gap;
}

function deg2rad(val) {
  var pi = Math.PI;
  var de_ra = ((eval(val))*(pi/180));
  return de_ra;
}

router.get('/join/images', (req, res)=>{
	let jeid = req.query.jeid;
        client.query("Select JPHOTOURL FROM JOINEVENT WHERE JEID = "+jeid, (err, result)=>{
                if(err){
                        res.end('File Load Error');
                }else{
                        fs.exists(result[0].JPHOTOURL, (exists)=>{
                         if(exists){
                                fs.readFile(result[0].JPHOTOURL, (err, data)=>{
                                        if(err){
                                                res.end('File Load Error');
                                        }else{
                                                res.end(data);
                                        }
                        });
                }else{
                        res.end('file is not Exists');
                }
        });

                }
        });
});

router.get('/edetail', (req, res) => {
	let eid = req.query.eid;
        console.log("check UID : " + eid);
        let sql = "Select JEID, UNAME, JDATE, JTITLE, JPHOTOURL from JOINEVENT, USER WHERE USER.UID = JOINEVENT.UID AND JOINEVENT.EID ="+eid; client.query(sql, (err, result)=>{
                if(err){
                        console.log("DB SELECT ERR, CHECK UID !");
                        res.status(500).send(false);
                }else{
                        if(result==null){
                                res.status(500).send("Empty");
                        }else
				var array = new Array();
                        for(var i=0;i<result.length;i++){
                                var obj = new Object();
                                obj.JEID = result[i].JEID;
				obj.UNAME = result[i].UNAME;
                                obj.JTITLE = result[i].JTITLE;
                                obj.JPHOTOURL = result[i].JPHOTOURL;
                                obj.JDATE = result[i].JDATE;
                                array.push(obj);
                        }
                        var finalObj = new Object();
                        finalObj.joinevent = array;
                        res.status(200).send(finalObj);
                     
                }
        });
});

router.post('/addteam', (req, res) => {
	console.log(req.body);;
        let json = JSON.parse(JSON.stringify(req.body));
	console.log("EMAIL : " + json.uemail+" / GPSX : " + json.gpsx + " / GPSY : " + json.gpsy);
        client.query("SELECT UNAME, LGPSX, LGPSY FROM USER, LOCATION WHERE USER.UID=LOCATION.UID AND USER.UEMAIL='" +json.uemail+"' ORDER BY LWHEN DESC limit 1", (err, result)=>{
        if(err){
                res.status(500).send("Non");
        }else{
		console.log("RESULT : " + result);
		if(result == '' ){
			res.status(500).send("None");
		}else{
		var array = new Array();
                let meter = getmeter(result[0].LGPSX, result[0].LGPSY, json.gpsx, json.gpsy);
                           console.log(meter);
                                if(meter <= (2000)){
                                        var obj = new Object();
                                        obj.UNAME = result[0].UNAME;
                                        array.push(obj);
                                }
   
                        var finalObj = new Object();
                        finalObj.add = array;
                        res.status(200).send(finalObj);
		}
		}
        });
});


router.post('/upload/images', (req, res) => {
	console.log("Yes connect");
	var form = new multiparty.Form();
	form.parse(req, (err, field, files)=>{
		console.log(files);
	});
});

router.post('/join', (req, res) => {
	var form = new multiparty.Form();
	form.on("field", (name, value)=>{
		console.log("Name : " + name+ " & Value : " + value);
	});
});

module.exports = router;
