# Dockerfile# base image
FROM node:lts-alpine# create & set working directory
WORKDIR /appCOPY package*.json ./# install dependencies
RUN yarn install# copy source files
COPY . .# start app
RUN yarn build
EXPOSE 3000
ENTRYPOINT ["yarn"]
CMD ["serve"]