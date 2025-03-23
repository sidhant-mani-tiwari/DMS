const express = require("express")
const router = express.Router();
const HomeRoute = require('./HomeRouter');
const AuthRouter = require('./AuthRouter');
const CommunityRouter = require('./CommunityRouter');
const IncidentRoute = require('./IncidentRouter');

router.use("/home",HomeRoute)
router.use("/auth",AuthRouter)
router.use("/community",CommunityRouter)
router.use("/incident",IncidentRoute)

module.exports = router;
