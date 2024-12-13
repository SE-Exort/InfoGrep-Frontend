FROM node:latest

WORKDIR /home/node/app

COPY package.json ./

RUN npm i
RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
