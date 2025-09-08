FROM node:20

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN rm -rf node_modules package-lock.json && npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]