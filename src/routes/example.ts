import axios from 'axios';
import Axios from 'axios';
import express, { Request, Response } from 'express';
import { allowAccess } from '../middleware/middleware';

const router = express.Router()





/**
 * GETting the data
 * Example api request for getting a random anime quote
 */
router.get('/', async (req, res, next) => {
  try {
    const request = await axios.get('https://animechan.vercel.app/api/random');

    if (request) {
      res.json(request.data);
    }
  } catch (error) {
    res.json(error);
  }
})

// Opening specific id
router.get('/:id', async (req, res, next) => {
  try {
    // create request
    const request = await axios.get('insert-url-here');

    if (request) {
      // if data exists
    }
  } catch (error) {
    // if data doesn't exist or if some other error arises
  }
})

// Create
router.post('/', async (req, res, next) => {
  try {
    // create request
    const request = await axios.post('insert-url-here');

    if (request) {
      // if data exists
    }
  } catch (error) {
    // if data doesn't exist or if some other error arises
  }
})

// Update
router.put('/', async (req, res, next) => {
  try {
    // create request
    const request = await axios.put('insert-url-here');

    if (request) {
      // if data exists
    }
  } catch (error) {
    // if data doesn't exist or if some other error arises
  }
})


// Delete with specific id
router.delete('/', async (req, res, next) => {
  try {
    // create request
    const request = await axios.delete('insert-url-here');

    if (request) {
      // if data exists
    }
  } catch (error) {
    // if data doesn't exist or if some other error arises
  }
})


export { router }