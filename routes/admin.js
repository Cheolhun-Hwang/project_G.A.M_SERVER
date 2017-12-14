const express = require('express');

const login = require("./admin/login");
const main = require("./admin/main");
const events = require("./admin/event");
const eventslist = require("./admin/eventlist");
const guide = require("./admin/guide");
const coupon = require("./admin/coupon");
const acc = require("./admin/acc");
const noti = require("./admin/notify");
const changepw = require("./admin/changepw");
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send("Admin start!!");
});

router.use('/login', login);
router.use('/main', main);
router.use('/event', events);
router.use('/eventlist', eventslist);
router.use('/guide', guide);
router.use('/coupon', coupon);
router.use('/acc', acc);
router.use('/notify', noti);
router.use('/changepw',changepw);
module.exports = router;
