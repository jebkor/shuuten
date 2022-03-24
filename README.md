# Shūten

## Introduction
Hello and thanks for your interest in Shūten!

Shūten is a boilerplate project to quickly be able to setup a node.js, Express-driven webserver from which to either run as a foundation for your frontend project or to test out a new and interesting API you found.

The name 'Shūten' comes from the Japanese word for 'endpoint' - a stretch, I know. But my boilerplate, my name 👹

---

## Running the project
Running the project is pretty straight forward:
* Either clone or fork the git repository
* Open up your command line (if you're on Windows, I recommend 'Windows Terminal') and run the following command 
  * > cd shuten
* With NPM installed on your system, run the following command to install the necessary dependencies
  * > npm install
* Once installed, run the following command and navigate to [localhost:3000](http://localhost:3000)
  * > npm run serve
* You should see a random quote from a random anime - if you see this, the Express server is running as intended and you can start playing around

---

## Included in the project
With this boilerplate, you get a few things:
* TypeScript support - I mean, it's written in TypeScript, mainly to avoid weird hoisting or variable shenanigans.
* The beginnings of being able to connect to MongoDB as a database - all you need is to find a mongoDB hosting place - I use [MongoDB](https://mongodb.com) as of writing this README. They have a great free tier if you just need to set something up while developing
* Example models - And if you're using MongoDB and using mongoose for interacting with the DB this way, some example models are also present to make life, hopefully, a little bit easier.
* The beginnings of having multiple routes - depending on how big your project is going to be, having multiple routes instead of one massive file is a *huuuge* benefit. As we say, 'separation of concern'.
* A login and signup feature with middleware - I've included this since it's a nice thing to have and a middleware that will check a API request if you're authorized to make said request.
* Mail signup - if you wanna send a verification link to your user, that should also have the bare minimum at the ready
* And other future features - maybe, it depends on a lot of things
