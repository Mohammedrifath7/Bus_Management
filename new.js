const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const { Server: socketServer } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Atlas connection
const MONGO_URI = 'mongodb+srv://Rifath_123:rifath_123@cluster0.43dmdkp.mongodb.net/bus_system';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB Schema for staffs
const staffSchema = new mongoose.Schema({
  name: String,
  email: String,
  bus_no: String,
  bus_stop: String,
  phone_no: String,
  driver_name: String,
});

// Define MongoDB Schema for students
const studentSchema = new mongoose.Schema({
  rollno: String,
  name: String,
  phone_no: String,
  bus_no: String,
  mail: String,
  parents_no: String,
  bus_stop: String,
  driver_name: String,
});

// Define MongoDB Schema for busroutes
const busRouteSchema = new mongoose.Schema({
  bus_no: String,
  routes: [{
    stop: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  }],
});

// Define MongoDB Schema for drivers
const driverSchema = new mongoose.Schema({
  name: String,
  phone_no: String,
  license_no: String,
});

// Create Mongoose models based on the schemas
const Staff = mongoose.model('Staff', staffSchema);
const Student = mongoose.model('Student', studentSchema);
const BusRoute = mongoose.model('BusRoute', busRouteSchema);
const Driver = mongoose.model('Driver', driverSchema);

// Route handlers for staffs collection
app.get('/staffs', async (req, res) => {
  try {
    const staffs = await Staff.find();
    res.json(staffs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/staffs', async (req, res) => {
  try {
    const newStaff = await Staff.create(req.body);
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/staffs/:name', async (req, res) => {
  try {
    const data = await Staff.findOne({ name: req.params.name })
    res.status(200).json(data);
  } catch(error) {
    res.status(400).json({ message: error.message })
  }
});


// Route handlers for students collection
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/students/:roll_no", async (req, res) => {
  try {
    const data = await Student.findOne({ rollno: req.params.roll_no })
    res.status(200).json(data);
  } catch(error) {
    res.status(400).json({ message: error.message })
  }
})

// Route handlers for busroutes collection
app.get('/busroutes', async (req, res) => {
  try {
    const busRoutes = await BusRoute.find();
    res.json(busRoutes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/busroutes', async (req, res) => {
  try {
    const newBusRoute = await BusRoute.create(req.body);
    res.status(201).json(newBusRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/busroutes/:bus_no", async (req, res) => {
  try {
    const data = await BusRoute.findOne({ bus_no: req.params.bus_no })
    res.status(200).json(data);
  } catch(error) {
    res.status(400).json({ message: error.message })
  }
})

// Route handlers for drivers collection
app.get('/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/drivers', async (req, res) => {
  try {
    const newDriver = await Driver.create(req.body);
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
const server = http.createServer(app);
const io = new socketServer(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.emit("con", "hi");
  // Handle socket events here
  socket.on("disconnect", () => {
    console.log("Socket client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
