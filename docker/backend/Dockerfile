FROM node:23-alpine

# Install Nest CLI globally (latest CLI compatible with Node 23)
RUN npm install -g @nestjs/cli

# App code will be bind-mounted in docker-compose
WORKDIR /usr/app

# Copy start script
WORKDIR /usr
COPY ./docker/backend/start.sh start.sh
RUN chmod +x /usr/start.sh

CMD ["sh", "/usr/start.sh"]