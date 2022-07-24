FROM postgres:alpine

EXPOSE ${DB_PORT}

CMD ["postgres", "-c", "logging_collector=on", "-c", "log_statement=mod"]
