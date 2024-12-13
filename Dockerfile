FROM node:latest

WORKDIR /home/node/app

COPY package.json ./

RUN npm i
RUN npm i -g serve

COPY . .

EXPOSE 3000
