FROM node:10-alpine

WORKDIR /app

COPY package.json package-lock.json  ./

RUN npm i
RUN npm i -g nodemon

COPY . .

CMD ["node", "app.js"]
