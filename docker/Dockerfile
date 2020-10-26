FROM sdelrio/docker-minimal-nginx

MAINTAINER Alex <zhuzhiqiang@deepexi.com>

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

ADD docker/nginx.conf /etc/nginx/

COPY dist/  /usr/share/nginx/html/

EXPOSE 8080