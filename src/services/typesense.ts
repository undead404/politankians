import instantsearch from 'instantsearch.js';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export default function getTypesenseSearch(apiKey: string, host: string) {
  const hostUrl = new URL(host);
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: apiKey, // Be sure to use an API key that only allows search operations
      nodes: [
        {
          host: hostUrl.hostname, // For Typesense Cloud use xxx.a1.typesense.net
          path: hostUrl.pathname,
          port: hostUrl.port ? Number.parseInt(hostUrl.port) : 443, // For Typesense Cloud use 443
          protocol: hostUrl.protocol.slice(0, -1), // For Typesense Cloud use https
        },
      ],
      cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
    },
    // The following parameters are directly passed to Typesense's search API endpoint.
    //  So you can pass any parameters supported by the search endpoint below.
    //  query_by is required.
    collectionSpecificSearchParameters: {
      acts_ru: {
        query_by: [
          'primaryParticipants.surname',
          'primaryParticipants.given_name',
          'primaryParticipants.middle_name',
          'secondaryParticipants.surname',
          'secondaryParticipants.given_name',
          'secondaryParticipants.middle_name',
          'tertiaryParticipants.surname',
          'tertiaryParticipants.given_name',
          'tertiaryParticipants.middle_name',
          'act_type',
          'settlement',
          'primaryParticipants.note',
          'secondaryParticipants.note',
          'tertiaryParticipants.note',
        ].join(','),
      },
      /*unstructured_uk: {
        query_by: ['surname', 'given_name', 'middle_name', 'note', 'misc'].join(
          ',',
        ),
      },*/
    },
  });
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  return instantsearch({
    indexName: 'acts_ru',
    routing: true,
    searchClient,
  });
}
