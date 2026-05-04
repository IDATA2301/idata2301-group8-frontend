export default {
  iam: {
    input: 'http://10.212.26.218/iam/v3/api-docs',
    output: {
      target: './src/api/iam.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customFetch'
        }
      }
    }
  },

  events: {
    input: 'http://localhost:8080/v3/api-docs',
    output: {
      target: './src/api/events.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customFetch'
        }
      }
    }
  }
};
