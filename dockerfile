FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache make gcc g++ python && \
  npm install --production --silent && \
  apk del make gcc g++ python

COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]