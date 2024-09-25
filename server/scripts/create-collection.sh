#!/usr/bin/env bash

source .env

curl "$TYPESENSE_HOST/collections" \
       -X POST \
       -H "Content-Type: application/json" \
       -H "X-TYPESENSE-API-KEY: ${TYPESENSE_ADMIN_KEY}" \
       -d '{
         "name": "acts",
         "enable_nested_fields": true,
         "fields": [
           {"facet": true, "locale": "uk", "name": "act_type", "type": "string" },
           {"name": "date", "type": "int64" },
           {"locale": "ru", "name": "primaryParticipants", "optional": true, "type": "object[]" },
           {"locale": "ru", "name": "secondaryParticipants", "optional": true, "type": "object[]" },
           {"facet": true, "locale": "uk", "name": "settlement", "type": "string" },
           {"locale": "ru", "name": "tertiaryParticipants", "optional": true, "type": "object[]" },
           {"name": "year", "type": "int32"}
         ]
       }'