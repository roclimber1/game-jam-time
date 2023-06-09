
FROM node:18


WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build-front
RUN npm run build


RUN rm -rf ./src
RUN rm -rf ./backend
RUN rm -rf ./common


EXPOSE 8080


CMD [ "node", "dist-server/backend/index.js" ]
