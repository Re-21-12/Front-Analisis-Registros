FROM node:lts-slim as build
WORKDIR /app
RUN npm install -g @angular/cli
COPY . ./
RUN npm ci
RUN ng build --configuration=production --output-path=/app/dist

# Etapa final solo para copiar archivos (sin Nginx)
FROM alpine:latest as final
WORKDIR /app
COPY --from=build /app/dist /app/dist
CMD ["sh", "-c", "echo 'Build completado. Los archivos están en /app/dist'"]
