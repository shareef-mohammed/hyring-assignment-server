require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cors = require('cors');

const app = express();

const connectdb = require('./config/dbconfig');
connectdb();

const clientRouter = require('./routes/clientRouter');
const freelancerRouter = require('./routes/freelancerRouter');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/client', clientRouter);
app.use('/freelancer', freelancerRouter);

app.listen(process.env.PORT, () => {
    console.log('Listening to the Server.');
})