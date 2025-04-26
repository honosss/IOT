
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const mqttService = require('./src/services/mqttService');
const logger = require('./src/utils/logger');

// 1️⃣ Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch(err => logger.error("MongoDB connection error:" + err));


// Khởi động MQTT Service
mqttService.start();

