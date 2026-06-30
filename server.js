require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Connect to MongoDB
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Connected to Atlas!'))
  .catch(err => console.log(err));

// --- API ROUTES ---
app.get('/api/user', async (req, res) => {
  const user = await User.findOne() || await User.create({});
  res.json(user);
});

app.put('/api/user', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({}, req.body, { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true 
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/internships', async (req, res) => {
  const apps = await Internship.find();
  res.json(apps);
});

app.post('/api/internships', async (req, res) => {
  const newApp = await Internship.create(req.body);
  res.json(newApp);
});

app.put('/api/internships/:id', async (req, res) => {
  const updatedApp = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedApp);
});

app.get('/api/network', async (req, res) => {
  const contacts = await Network.find();
  res.json(contacts);
});

app.post('/api/network', async (req, res) => {
  const contact = await Network.create(req.body);
  res.json(contact);
});

app.get('/api/analytics', async (req, res) => {
  const totalApps = await Internship.countDocuments();
  const interviews = await Internship.countDocuments({ status: 'Interview' });
  const contacts = await Network.countDocuments();
  res.json({
    applications: totalApps,
    interviews: interviews,
    networkingGrowth: contacts
  });
});

// --- FRONTEND ROUTE (Must be last) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server with dynamic Railway port
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
