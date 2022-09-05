# Development Stage
FROM node:16.17.0-buster as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run compile

# Production Stage
FROM node:16.17.0-alpine3.15 as production-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build-stage /app/lib /app/lib
COPY --from=build-stage /app/config /app/config
COPY --from=build-stage /app/public /app/public

## Launch the wait tool and then the application
CMD npm start