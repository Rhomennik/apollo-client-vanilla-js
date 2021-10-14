// import init Keycloak
require("./keycloak");
// import init Client Apollo Client
const client = require("./client");

const { gql } = require("apollo-boost");


// API URL 
https://api.fidelisbet.dev/graphql

// Query Leagues
const queryLeagues = gql`
  query getLeagues {
    leagues {
      id
      flag
      title
    }
  }
`;

// GetLeagues
client.query({ query: queryLeagues }).then((data) => {
  console.log("Leagues 🌟", data);
});

// Get Match with authenticated (Match)
const queryMatch = gql`
  query getMatches {
    matches {
      id
      homeTeam
      awayTeam
    }
  }
`;

if (localStorage.getItem("token")) {
  client.query({ query: queryMatch }).then((data) => {
    console.log("Match", data);
  });
}

// Subscription
const subMatches = gql`
  subscription subMatches {
    matchOnChanges {
      payload {
        id
        pressure {
          home
          away
        }
        odd1x2 {
          home
          draw
          away
        }
      }
    }
  }
`;

if (localStorage.getItem("token")) {
  client
    .subscribe({
      query: subMatches,
    })
    .subscribe(
      (data) => {
        console.log("Data", data);
      },
      (err) => {
        console.error("Error", err);
      }
    );
}
