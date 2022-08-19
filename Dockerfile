FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
ARG MODE=production
ENV ENV_FILE=.env.$MODE
RUN if [ ! -f "$ENV_FILE" ]; then echo "$ENV_FILE does not exist. Using default"; fi
RUN if [[ -f "$ENV_FILE" && $ENV_FILE != ".env.production" ]]; then cp -f $ENV_FILE .env.production; fi
RUN npm run build

# production environment
FROM nginx:stable
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000