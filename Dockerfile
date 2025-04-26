FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000 50051

CMD ["npm", "run", "start:all"]