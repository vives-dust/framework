FROM node:18.10-alpine3.15 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

COPY ./docs-docker /app/dist

FROM nginx:1.23.1-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
