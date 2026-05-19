export default {
  iam: {
    input: 'https://64.226.83.250/iam/v3/api-docs',
    output: {
      tsconfig: './tsconfig.app.json',
      target: './src/api/iam.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customFetchIamApi'
        }
      }
    }
  },

  events: {
    input: "https://64.226.83.250/event/v3/api-docs",
    output: {
      tsconfig: "./tsconfig.app.json",
      target: "./src/api/events.ts",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/api/client.ts",
          name: "customFetchEventApi"
        }
      }
    }
  },

  order: {
    input: 'https://64.226.83.250/order/v3/api-docs',
    output: {
      tsconfig: './tsconfig.app.json',
      target: './src/api/orders.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customFetchOrderApi'
        }
      }
    }
  }
};
