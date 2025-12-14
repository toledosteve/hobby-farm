FROM node:23-alpine

# App code will be bind-mounted in docker-compose
WORKDIR /usr/app

# Copy start script
WORKDIR /usr
COPY ./docker/frontend/start.sh start.sh
RUN chmod +x /usr/start.sh

CMD ["sh", "/usr/start.sh"]