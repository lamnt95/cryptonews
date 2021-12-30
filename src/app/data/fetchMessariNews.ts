const body = {
  operationName: 'AggregatedContents',
  variables: {
    first: 20,
    where: {
      title_like: null,
      assetSlugs_in: null,
      subTypes_in: ['OFFICIAL_PROJECT_UPDATES'],
    },
    after: 0,
  },
  query:
    'query AggregatedContents($first: Int, $after: PaginationCursor, $last: Int, $before: PaginationCursor, $where: AggregatedContentWhereInput) {\n  aggregatedContents(\n    first: $first\n    after: $after\n    last: $last\n    before: $before\n    where: $where\n  ) {\n    totalCount\n    pageInfo {\n      hasPreviousPage\n      hasNextPage\n      startCursor\n      endCursor\n      __typename\n    }\n    edges {\n      cursor\n      node {\n        id\n        subType\n        type\n        title\n        publishDate\n        link\n        assets {\n          id\n          name\n          slug\n          symbol\n          __typename\n        }\n        source {\n          id\n          platform\n          link\n          creator {\n            id\n            name\n            link\n            slug\n            ... on AssetCreator {\n              id\n              name\n              slug\n              asset {\n                id\n                name\n                slug\n                logo\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
};

export const fetchOfficialNewMessari = {
  url: 'https://graphql.messari.io/query',
  body,
};
