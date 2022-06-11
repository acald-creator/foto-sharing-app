ARG NODE_VERSION=16

FROM node:${NODE_VERSION}-slim as build

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN yarn install

FROM gcr.io/distroless/nodejs:${NODE_VERSION}

COPY --from=0 /usr/src/app /usr/src/app

WORKDIR /usr/src/app

EXPOSE 8080

CMD ["src/server.ts"]