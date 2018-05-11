# palette-picker

[![Build Status](https://travis-ci.org/patrickmc21/palette-picker.svg?branch=master)](https://travis-ci.org/patrickmc21/palette-picker)

An application used generate color palettes, and save palettes to project folders. App is built on the front end using jQuery, JavaScript and CSS. Backend is build using Express and Knex. Continuous Integration provided by Travis CI. Test Suite build using Mocha/Chai

## Team

+[Pat McLaughlin](https://github.com/patrickmc21)

## Project Status

This project is currently through the MVP requirements, which allows a user to generate random color palettes, lock in preferred colors, and save palettes to project folders for later referral. 

## Project Screen Shots

#### Desktop

![Main](readme-images/main.png)

## Installation and Setup Instructions

Clone down this repository. You will need `node`, `npm`, `postgres`, and `knex` installed globally on your machine.  

Installation:

`npm install`
`psql`
`CREATE DATABASE palettepicker`
`knex migrate:latest`

To Run Test Suite:  

`psql`
`CREATE DATABASE palettepicker_test`
`knex migrate:latest`
`npm test`  

To Start Server:

`npm start`  

To Visit App:

`localhost:3000`

## Reflection

This was a one week individual project during module four of the frontend program at Turing. Project goals included creating a site that generated a random color palette, and allowed users to lock in colors, and save palettes to different project folders. 

App was built using Javascript, jQuery, CSS, Express, and Knex. Test Suite built using Mocha/Chai.



