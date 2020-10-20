FROM node:14-alpine

EXPOSE 8080

RUN mkdir -p /cortex/node_modules
RUN chown -R node:node /cortex

ENV NODE_ENV=production
WORKDIR /cortex

USER node

COPY package*.json /cortex/

RUN npm install

COPY --chown=node:node dist/ /cortex/

CMD [ "node", "index.js" ]
