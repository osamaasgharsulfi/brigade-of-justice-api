const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const caseRoutes = require('./routes/Case.routes');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/Auth.routes');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/cases', caseRoutes);

module.exports = app;
