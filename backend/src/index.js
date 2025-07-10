require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Travel Agent Email Automation API');
});

// Register routes here (auth, agents, guests, trips, email)
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const guestRoutes = require('./routes/guests');
const tripRoutes = require('./routes/trips');
const emailRoutes = require('./routes/email');
const emailTemplateRoutes = require('./routes/emailTemplates');

app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/templates', emailTemplateRoutes);

// Connect to DB and start server
const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
