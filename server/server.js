const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express();
dotenv.config({ path: './server/.env' });
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');
const EqRoot1 = require('./models/db');
const IntegralApi = require('./models/dbintegral');
const DiffApi = require('./models/dbdiff');
const GaussApi = require('./models/dbgauss');
const InterpolationApi = require('./models/dbinter');
const RegressionApi = require('./models/dbregress');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'A simple API documentation',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  },
  apis: ['./server/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))


const port = 4000 || 7000
const MONGO_URL = "mongodb+srv://mew:1234@cluster0.eqc3j.mongodb.net/numerical"
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(port, () => {
  console.log(`server running at port ${port}`)
})

mongoose.connect(MONGO_URL).then(() => {
  console.log("Connected Success")
}).catch((error) => console.log(error))


app.get('/api/equations', async (req, res) => {
  try {
    const dataFound = await EqRoot1.find();
    console.log(dataFound);
    res.send(dataFound);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/Add-equations', async (req, res) => {
  const { methodType, func, xL, xR, table, epsilon, answer } = req.body;
  try {
    const newEquation = new EqRoot1({
      methodType,
      equation: func,
      xl: xL,
      xr: xR,
      table,
      epsilon,
      answer
    });
    await newEquation.save();
    res.status(201).json(newEquation);
  } catch (error) {
    console.error('Error saving equation:', error); // Log the error details
    res.status(500).json({ message: 'Failed to save equation', error: error.message });
  }
});












app.get('/api/Gauss', async (req, res) => {
  try {
    const dataFound = await GaussApi.find();
    console.log(dataFound);
    res.send(dataFound);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post('/api/Add-Gauss', async (req, res) => {
  console.log('Request Body:', req.body);
  const { methodType, equation, size, answer, err, table } = req.body;
  try {
    const newEquation = new GaussApi({
      methodType,
      equation,
      size,
      answer,
      err,
      table
    });
    await newEquation.save();
    res.status(201).json(newEquation);
  } catch (error) {
    console.error('Error saving equation:', error);
    res.status(500).json({ message: 'Failed to save equation', error: error.message });
  }
});


app.get('/api/Interpolation', async (req, res) => {
  try {
    const dataFound = await InterpolationApi.find();
    console.log(dataFound);
    res.send(dataFound);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.post('/api/Add-Interpolation', async (req, res) => {
  console.log('Request Body:', req.body);
  const { methodType, points, xTarget, answer, n, chart } = req.body;
  try {
    const newEquation = new InterpolationApi({
      methodType,
      points,
      xTarget,
      answer,
      n,
      chart
    });
    await newEquation.save();
    res.status(201).json(newEquation);
  } catch (error) {
    console.error('Error saving equation:', error);
    res.status(500).json({ message: 'Failed to save equation', error: error.message });
  }
});



