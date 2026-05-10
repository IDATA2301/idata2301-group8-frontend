export default {
  // iam: {
  //   input: 'http://10.212.26.218/iam/v3/api-docs',
  //   output: {
  //     tsconfig: './tsconfig.app.json',
  //     target: './src/api/iam.ts',
  //     client: 'react-query',
  //     override: {
  //       mutator: {
  //         path: './src/api/client.ts',
  //         name: 'customFetchIamApi'
  //       }
  //     }
  //   }
  // },

  events: {
    input: 'http://localhost:8080/v3/api-docs',
    output: {
      tsconfig: './tsconfig.app.json',
      target: './src/api/events.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customFetchEventApi'
        }
      }
    }
  },

  // order: {
  //   input: 'http://localhost:8080/v3/api-docs',
  //   output: {
  //     tsconfig: './tsconfig.app.json',
  //     target: './src/api/orders.ts',
  //     client: 'react-query',
  //     override: {
  //       mutator: {
  //         path: './src/api/client.ts',
  //         name: 'customFetchOrderApi'
  //       }
  //     }
  //   }
  // }
};
