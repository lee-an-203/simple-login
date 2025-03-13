
FROM node:20-alpine

USER root

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["nodemon", "server.js"]

