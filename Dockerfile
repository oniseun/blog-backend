
FROM node:12.13-alpine

WORKDIR /usr/src/blog-backend

COPY package*.json ./

COPY .envsample ./.env

COPY ./src ./src

COPY ./test ./test

RUN npm install

EXPOSE 7200
CMD ["npm", "run", "prod"]