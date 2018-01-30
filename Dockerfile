FROM node:7.3-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm i --silent

# Bundle app source
COPY . /usr/src/app

EXPOSE 80 443
CMD [ "npm", "start" ]
