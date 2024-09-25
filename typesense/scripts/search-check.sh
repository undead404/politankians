#!/usr/bin/env bash

source .env


curl -H "X-TYPESENSE-API-KEY: ${TYPESENSE_SEARCH_KEY}" \
"${TYPESENSE_HOST}/collections/acts/documents/search\
?q=Дидик&query_by=primaryParticipants&sort_by=year:desc"