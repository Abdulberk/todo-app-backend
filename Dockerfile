FROM node:18.12.0

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "test"]


