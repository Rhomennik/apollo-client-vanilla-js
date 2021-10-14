const {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
} = require("apollo-boost");
const { WebSocketLink } = require("@apollo/client/link/ws");
const { getMainDefinition } = require("@apollo/client/utilities");

let headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

const wsLink = new WebSocketLink({
  uri: "ws://api.fidelisbet.dev/graphql",
  timeout: 5000,
  options: {
    reconnect: true,
    connectionParams: () => {
      return {
        ...headers,
      };
    },
  },
});

const link = new HttpLink({
  uri: "https://api.fidelisbet.dev/graphql",
  headers: headers,
});

const httpLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  link
);

module.exports = new ApolloClient({
  link: httpLink,
  wsLink,
  cache: new InMemoryCache(),
});
