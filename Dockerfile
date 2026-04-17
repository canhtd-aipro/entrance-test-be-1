FROM node:20-slim AS base

ARG NODE_OPTIONS
ENV NODE_OPTIONS=$NODE_OPTIONS

RUN apt-get update \
  && apt-get install -y ffmpeg libreoffice \
  && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 2000 app \
  && useradd -m -u 2000 -g 2000 app
USER app

# create directory where the application will be built
WORKDIR /app

# copy over the dependency manifests, both the package.json 
# and the package-lock.json are copied over
COPY --chown=app:app package.json yarn.lock ./

# installs packages and their dependencies
RUN yarn install --frozen-lockfile

# copy over the prisma schema
#COPY prisma/schema.prisma ./prisma/

COPY --chown=app:app . .

# create the bundle of the application
RUN yarn build

# start the server using the previously build application
CMD [ "node", "./dist/main.js" ]