
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const mqttService = require('./src/services/mqttService');

// 1️⃣ Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));


// Khởi động MQTT Service
mqttService.start();

