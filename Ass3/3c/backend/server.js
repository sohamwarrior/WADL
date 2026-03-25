const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://sompatil2005_db_user:RecHPR4qe81lW5W0@cluster0.gj7iriu.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// ---------- Schemas ----------

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const appointmentSchema = new mongoose.Schema({
  email: String,
  name: String,
  phone: String,
  gender: String,
  subject: String,
  message: String,
  preferredDays: [String],
  date: String
});

const User = mongoose.model('User', userSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ---------- Routes ----------

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  res.json({ message: 'Registration successful' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ name: user.name, email: user.email });
});

// Book Appointment
app.post('/api/appointments', async (req, res) => {
  const { email, name, phone, gender, subject, message, preferredDays } = req.body;
  const appointment = new Appointment({
    email, name, phone, gender, subject, message, preferredDays,
    date: new Date().toLocaleString()
  });
  await appointment.save();
  res.json({ message: 'Appointment booked successfully' });
});

// Get Appointments for a user by email
app.get('/api/appointments/:email', async (req, res) => {
  const appointments = await Appointment.find({ email: req.params.email });
  res.json(appointments);
});

// Delete Appointment
app.delete('/api/appointments/:id', async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Appointment deleted' });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
