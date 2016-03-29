FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY /server/package.json /usr/src/app/
RUN npm install
RUN npm install babel-cli -g

# Bundle app source
COPY ./server /usr/src/app

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV production

CMD ["npm", "start"]
