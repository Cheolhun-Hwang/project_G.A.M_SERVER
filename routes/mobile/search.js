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

router.get('/', (req, res) => {
	res.send('search');
});

router.get('/guide', (req, res) => {
	let dist = req.query.dist;
	let gpsx = req.query.gpsx;
	let gpsy = req.query.gpsy;

	console.log("dist : "+ dist +"/gpsx : "+gpsx+"/gpsy : "+gpsy);
	client.query("SELECT * FROM GUIDE", (err, result)=>{
		if(err){
			res.send("DB FAIL");
		}else{
			var array = new Array();
			for(var i=0;i<result.length;i++){
				console.log('get GPS : ' + gpsx + " / "+ gpsy+" & result GPS : " + result[i].GGPSX+" / "+result[i].GGPSY);
				let meter = getmeter(gpsx, gpsy, result[i].GGPSX, result[i].GGPSY);
				console.log(meter);
				if(meter <= (dist*1000)){
					console.log("Add Spot");
					var obj = new Object();
					obj.GID = result[i].GID;
					obj.GWHERE = result[i].GWHERE;
					obj.GMODIFY = result[i].GMODIFYDATE;
					obj.GGPSX = result[i].GGPSX;
					obj.GGPSY = result[i].GGPSY;
					obj.GAUDIO = result[i].GAUDIO;
					obj.GPHOTO = result[i].GPHOTOURL;
					obj.GMETER = meter;
					array.push(obj);
				}
			}
			var finalObj = new Object();
			finalObj.guide = array;
			res.status(200).send(finalObj);	
		}
	});
});



router.get('/guide/audio', (req, res)=>{
	let file = req.query.file;
	client.query("Select GAUDIO FROM GUIDE WHERE GAUDIO LIKE '%"+file+"'", (err, result)=>{
		if(err){
			res.end('File Load Error');
		}else{
			fs.exists(result[0].GAUDIO, (exists)=>{
               		 if(exists){
                        	fs.readFile(result[0].GAUDIO, (err, data)=>{
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

router.get('/guide/images', (req, res)=>{
        let gid = req.query.gid;
        client.query("Select GPHOTOURL FROM GUIDE WHERE GID = "+gid, (err, result)=>{
                if(err){
                        res.end('File Load Error');
                }else{
                        fs.exists(result[0].GPHOTOURL, (exists)=>{
                         if(exists){
                                fs.readFile(result[0].GPHOTOURL, (err, data)=>{
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

router.get('/event', (req, res) => {
	let dist = req.query.dist;
        let gpsx = req.query.gpsx;
        let gpsy = req.query.gpsy;

        console.log("dist : "+ dist +"/gpsx : "+gpsx+"/gpsy : "+gpsy);
        client.query("SELECT EID, ENAME, EDEADLINEDATE, GPHOTOURL, ENUM, EPROFIT, ECORDINATION, EWHERE, EGPSX, EGPSY FROM GUIDE, EVENT WHERE GUIDE.GWHERE=EVENT.EWHERE", (err, result)=>{
                if(err){
                        res.send("DB FAIL");
                }else{
                        var array = new Array();
                        for(var i=0;i<result.length;i++){
				console.log('get GPS : ' + gpsx + " / "+ gpsy+" & result GPS : " + result[i].EGPSX+" / "+result[i].EGPSY);
                                let meter = getmeter(gpsx, gpsy, result[i].EGPSX, result[i].EGPSY);
                                console.log(meter);
                                if(meter <= (dist*1000)){
					var obj = new Object();
					obj.EID = result[i].EID
                                        obj.ENAME = result[i].ENAME;
                                        obj.EDEADLINE = result[i].EDEADLINEDATE;
                                        obj.GPHOTO = result[i].GPHOTOURL;
                                        obj.EGPSX = result[i].EGPSX;
                                        obj.EGPSY = result[i].EGPSY;
                                        obj.ENUM = result[i].ENUM;
                                        obj.EPROFIT = result[i].EPROFIT;
					obj.ECORDI = result[i].ECORDINATION;
					obj.EWHERE = result[i].EWHERE;
                                        array.push(obj);
				}
			}
                        var finalObj = new Object();
                        finalObj.events = array;
                        res.status(200).send(finalObj);
                }
        });

});

router.get('/event/images', (req, res)=>{
        let eid = req.query.eid;
        client.query("SELECT GPHOTOURL FROM GUIDE, EVENT WHERE GUIDE.GWHERE=EVENT.EWHERE AND EVENT.EID = "+eid, (err, result)=>{
                if(err){
                        res.send('File Load Error');
                }else{
                        fs.exists(result[0].GPHOTOURL, (exists)=>{
                         if(exists){
                                fs.readFile(result[0].GPHOTOURL, (err, data)=>{
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

router.get('/gdetail', (req, res) => {
	let gid = req.query.gid;
	client.query("SELECT * FROM DETAILGUIDE WHERE gid="+gid, (err, result)=> {
		if(err){
			res.status(500).send("DB ERRER ... GDETAIL");
		}else{
			var array = new Array();
                        for(var i=0;i<result.length;i++){
                                 var obj = new Object();
                                 obj.GCONTEXT = result[i].GCONTEXT;
                              	 obj.GPHOTOURLS = result[i].GPHOTOURLS;
                                 array.push(obj);
                        }
                        
                        var finalObj = new Object();
                        finalObj.dguide = array;
                        res.status(200).send(finalObj);
		}
	} );
});

router.get('/dguide/images', (req, res)=>{
        let gid = req.query.gid;
	let file = req.query.file;
                  fs.exists("public/images/guide/"+gid+"/"+file, (exists)=>{
                     if(exists){
                          fs.readFile("public/images/guide/"+gid+"/"+file, (err, data)=>{
                                if(err){
                                        res.end('File Load Error');
                                }else{
                                        res.end(data);
                                }
                          });
                     }
		});
});


module.exports = router;
