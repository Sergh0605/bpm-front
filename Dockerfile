FROM node:12-alpine as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install --only=prod
COPY . /app
RUN npm run build
FROM nginx:1.19.6
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.default.conf /etc/nginx/conf.d/
CMD rm /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]