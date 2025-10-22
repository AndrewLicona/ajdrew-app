FROM nginx:alpine

# Copiar configuración de Nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Puerto expuesto
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
