FROM node:16.4.2-buster

EXPOSE 5000

COPY package.json package.json

RUN npm install

COPY . .

RUN REACT_APP_ORCHID_HOST='https://orchid.ps1infra.net' npm run build

CMD node server/index.js