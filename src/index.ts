const uri = 'insert-mongodb-connection-uri';

import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser'
import { glamRouter } from './routes/example';
import { authRouter } from './routes/auth';
import { environment } from '../environtment';
import cors from 'cors';
import { ensureLogIn, allowAccess } from './middleware/middleware';
import multer from 'multer';


const upload = multer();


// init express server
const app = express()

// solution found on https://brianflove.com/2017-03-22/express-cors-typescript/
//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token'
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: 'http://localhost:8080', //'https://sharlayan-dresser-dev.netlify.app', //'http://localhost:8080', //,
  preflightContinue: false,
};
app.use(cors(options))
app.use(cookieParser(environment.COOKIE_SECRET));
app.use('/src/images', express.static(path.join(__dirname, '/images')));
app.use(json())
// Then pass these options to cors:
app.use(glamRouter, cors(options))
app.use(authRouter, cors(options))

// connect to mongoose
// mongoose.connect(uri, {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// })



// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('Connected to the database!'))



// JSONified error message
app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: '❌'
  })
})



app.listen(process.env.PORT || 3000, () => {
  console.log(`server is listening on port ${process.env.PORT || '3000'}`)
})
