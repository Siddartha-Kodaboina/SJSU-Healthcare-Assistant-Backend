import express from 'express';
import cors from 'cors';
import BodyParser from 'body-parser';
import pkg from 'mongodb';
const { MongoClient, ObjectId } = pkg;
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from '@copilotkit/runtime';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(BodyParser.json());
app.use(express.static('doctors'));
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f26vm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log("URI : ", uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
  const doctorCollection = client.db('doctorsPortal').collection('doctors');
  const appointmentCollection = client.db('doctorsPortal').collection('appointments');
  const reviewCollection = client.db('doctorsPortal').collection('reviews');

  console.log('Doctors Portal DataBase Connected');

  // Routes -- Get method
  app.get('/', (req, res) => res.send('Welcome to Doctors Portal Backed'));

  // Get all services Information
  app.get('/doctors', (req, res) => {
    doctorCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get('/doctors/:apId', async (req, res) => {
    try {
        const apId = req.params.apId;
        const doctor = await doctorCollection.findOne({ id: apId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
  });

  // Get all Booked Appointments
  app.get('/bookedAppointments', (req, res) => {
    appointmentCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // Get all Reviews
  app.get('/allReviews', (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // Routes -- Post method
  // Added all doctors Information
  app.post('/addDoctor', (req, res) => {
    const doctorData = req.body;
    doctorCollection.insertMany(doctorData).then((result) => {
      console.log(result.insertedCount, 'All Data Inserted');
      res.send(result.insertedCount);
    });
  });

  // Insert Appointment Booking
  app.post('/makeBooking', (req, res) => {
    const appointmentData = req.body;
    appointmentCollection.insertOne(appointmentData, (err, result) => {
      console.log(result.insertedCount, 'Appointment Inserted');
      res.send(result.insertedCount > 0);
    });
  });

  // Insert A New Doctor
  app.post('/addADoctor', (req, res) => {
    const file = req.files.file;
    const id = req.body.id;
    const category = req.body.category;
    const name = req.body.name;
    const education = req.body.education;
    const designation = req.body.designation;
    const department = req.body.department;
    const hospital = req.body.hospital;
    const img = req.body.img;

    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    doctorCollection
      .insertOne({ id, category, name, education, designation, department, hospital, img, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
        console.log(result.insertedCount, 'Doctor Inserted');
      });
  });

  // Added A New Doctor Review
  app.post('/addReview', (req, res) => {
    const reviewData = req.body;
    reviewCollection.insertOne(reviewData).then((result) => {
      res.send(result.insertedCount > 0);
      console.log(result.insertedCount, 'Review Data Inserted');
    });
  });

  // CopilotKit Integration
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const serviceAdapter = new OpenAIAdapter({ openai });

  app.use('/copilotkit', (req, res, next) => {
    const runtime = new CopilotRuntime();
    const handler = copilotRuntimeNodeHttpEndpoint({
      endpoint: '/copilotkit',
      runtime,
      serviceAdapter,
    });

    return handler(req, res, next);
  });

  // Start the server
  const port = process.env.PORT || 5001;
  app.listen(port, (err) => (err ? console.log('Failed to Listen on Port', port) : console.log('Listening for Port', port)));
});
