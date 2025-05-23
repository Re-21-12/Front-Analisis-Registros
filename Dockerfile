# Etapa 1: Construcción
FROM node:18 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación Angular
RUN npm run build-prod

# Etapa 2: Servir la aplicación
FROM nginx:1.25

# Copiar los archivos construidos al servidor Nginx
COPY --from=build /app/dist/vuelos-front/browser /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
