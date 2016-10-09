FROM node:6.3.1

# Update
# RUN apk add --update nodejs@6.3.1

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install

# Bundle app source
COPY . /src

EXPOSE  8080
RUN cd ./src/server
CMD ["node", "server.js"]
