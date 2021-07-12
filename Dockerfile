FROM node:16.4.2-buster

RUN apk update && apk upgrade && \
    apk add --no-cache git

RUN npm install -g serve

EXPOSE 5000

COPY package.json package.json

RUN npm install

COPY . .

RUN REACT_APP_ENV=prod npm run build

CMD serve -s build -l 5000