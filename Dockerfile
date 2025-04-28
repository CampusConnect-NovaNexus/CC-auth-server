FROM node:23-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl bash wget
RUN wget -O /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x /usr/local/bin/wait-for-it.sh

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3500 50053

# Use wait-for-it script to wait for Redis before starting
CMD ["/bin/bash", "-c", "wait-for-it.sh redis:6379 -t 60 -- npm run start:all"]