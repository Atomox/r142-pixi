# Dockerfile for a node container, to be included as part of a docker-compose
# file. This does not start the app on it's own, but sets up the environment,
# prepping to be run in the compose file.
FROM node:9.1.0

# Install forever
RUN npm install forever -g

# Create a source directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .
RUN npm install

# Install mocha
RUN npm install mocha --global

# Run app from docker-compose.xml
# RUN forever start app.js
