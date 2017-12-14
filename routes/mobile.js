const express = require('express');
const mysql = require('mysql');
const search = require('./mobile/search');
const login = require('./mobile/login');
const events = require('./mobile/event');
const set = require('./mobile/set');
const notice = require('./mobile/notice');
const coupon = require('./mobile/coupon');

const client = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'Thurs_1team',
        password: 't1t13579',
        database: 'Thurs_1team'
});

const router = express.Router();

router.get('/', (req, res) => {
	res.send('Hi');
});
router.use('/search', search);
router.use('/login', login);
router.use('/event', events);
router.use('/set', set);
router.use('/notice', notice);
router.use('/coupon', coupon);

router.post('/gps/add',(req, res)=>{
	console.log(req.body);;
        let json = JSON.parse(JSON.stringify(req.body));
        console.log("Time : "+ json.date+ " / gpsx : " + json.gpsx + " / gpsy : " + json.gpsy+" / uid : "+json.uid);
        client.query("INSERT INTO LOCATION (UID, LWHEN, LWHERE, LGPSX, LGPSY) VALUES (?,?,?,?,?)", [json.uid, json.date, json.spot, json.gpsx, json.gpsy], (err)=>{
        if(err){
                res.status(500).send("None");
        }else{
                res.status(200).send("true");
        }
        }); 
});


module.exports = router;
