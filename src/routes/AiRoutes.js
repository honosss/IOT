const express = require('express');
const { handleAidata } = require('../controllers/AiController');

const router = express.Router();


router.post('/process', handleAidata);

module.exports = router;