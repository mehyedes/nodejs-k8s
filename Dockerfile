FROM node:12-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

USER node
CMD ["npm", "run", "start"]
