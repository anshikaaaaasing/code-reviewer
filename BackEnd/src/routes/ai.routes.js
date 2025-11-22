const express = require('express');
const aiController = require("../controllers/ai.controller")

const router = express.Router();

router.post("/get-review", aiController.getReview)
router.get("/history/:userId", aiController.getReviewHistory)
router.get("/details/:reviewId", aiController.getReviewDetails)

module.exports = router;    