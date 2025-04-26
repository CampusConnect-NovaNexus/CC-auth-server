FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN apt-get update -y && apt-get install -y openssl

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000 50053

CMD ["npm", "run", "start:all"]