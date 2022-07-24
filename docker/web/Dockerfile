FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE ${PORT}

CMD [ "npm", "run", "start:dev" ]
