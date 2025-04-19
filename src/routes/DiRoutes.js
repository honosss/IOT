const express = require('express');
const { handleDiMessage  } = require('../controllers/DiController');

const router = express.Router();

router.post('/process-di', handleDiMessage)
module.exports = router;