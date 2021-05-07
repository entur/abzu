FROM node:15.14.0-alpine3.10

RUN addgroup appuser && adduser --disabled-password --gecos '' appuser --ingroup appuser

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --chown=appuser:appuser . .

EXPOSE 8000
ENV port 8000
USER appuser

CMD [ "npm", "run", "prod" ]
