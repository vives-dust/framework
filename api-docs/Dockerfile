FROM node:alpine AS build-stage
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

COPY ./docs /app/dist

FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html

