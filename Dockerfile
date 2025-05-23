
FROM node:18 AS build


WORKDIR /app

# Copiar archivos necesarios
COPY package.json package-lock.json ./
RUN npm install


COPY . .

# Construir la aplicación Angular
RUN npm run build-prod

# Etapa 2: Servir la aplicación
FROM nginx:1.25

# Copiar los archivos construidos al servidor Nginx
COPY --from=build /app/dist/vuelos-front /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80
