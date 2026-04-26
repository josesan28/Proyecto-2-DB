FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE ${PORT:-3001}

CMD ["node", "index.js"]