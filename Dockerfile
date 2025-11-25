# Dockerfile para el frontend React
FROM node:18-alpine AS builder

# Metadatos
LABEL maintainer="Chatbot IA - Universidad de Caldas"
LABEL description="Frontend React para Chatbot IA"

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias 
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
# REACT_APP_API_URL se inyectará en tiempo de ejecución
ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Etapa de producción con nginx
FROM nginx:alpine

# Copiar build de React
COPY --from=builder /app/build /usr/share/nginx/html

# Script para configurar nginx con puerto dinámico
RUN echo '#!/bin/sh\n\
PORT="${PORT:-80}"\n\
echo "server {\n\
    listen $PORT;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \\$uri \\$uri/ /index.html;\n\
    }\n\
}" > /etc/nginx/conf.d/default.conf\n\
nginx -g "daemon off;"' > /start.sh && chmod +x /start.sh

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-80}/ || exit 1

# Iniciar con script que configura puerto dinámico
CMD ["/bin/sh", "/start.sh"]

