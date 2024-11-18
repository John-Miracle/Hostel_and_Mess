// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('Public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI = "mongodb+srv://John:john123@hosteldata.gr26gta.mongodb.net/Data?retryWrites=true&w=majority&appName=HostelData";
mongoose.connect(mongoURI);
const db = mongoose.connection;

// Check MongoDB connection status
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Define Schema for men's and women's hostels
const dataSchema = new mongoose.Schema({
    hostelType: String,  // 'men' or 'women'
    index: Number,
    name: String,
    data: {
        sum: String,
        amenities: [String],
        floor_plan: String,
        room_t_no: Number,
        room: Object,
        mess: Object,
        B_image: String,
    }
});

const hostelData = mongoose.model('Hostel', dataSchema);

// GET method to fetch data by index and hostel type
app.get("/hostelData", (req, res) => {
    const index = parseInt(req.query.index); // Extract index from the query parameter
    const hostelType = req.query.hostelType;  // Extract hostelType from the query parameter

    hostelData.findOne({ index, hostelType })
    .then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).send("Data not found");
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).send("Error fetching data from MongoDB");
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
