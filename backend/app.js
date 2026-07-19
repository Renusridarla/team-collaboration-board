require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const calendarRoutes = require('./src/routes/calendarRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/calendar', calendarRoutes);

connectDB().catch((error) => {
  console.error('Database connection error:', error);
});

module.exports = app;
