
FROM node:18


WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build-front
RUN npm run build


RUN rm -rf ./src
RUN rm -rf ./backend


EXPOSE 8080


CMD [ "node", "dist/backend/index.js" ]
