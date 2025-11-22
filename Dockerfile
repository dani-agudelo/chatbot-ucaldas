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

# Copiar configuración de nginx (opcional, para SPA)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

