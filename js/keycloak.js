const Keycloak = require("keycloak-js");

// KeyCloak
const keycloak = new Keycloak({
  clientId: "app-mobile",
  realm: "fidelis",
  url: "https://account.fidelisbet.dev/auth/",
  scheme: "fidelis",
});

module.exports = keycloak
  .init({
    onLoad: "check-sso",
    silentCheckSsoRedirectUri:
      window.location.origin + "/silent-check-sso.html",
  })
  .then(function (authenticated) {
    if (!authenticated) {
      keycloak.login();
    }

    if (keycloak.token) {
      localStorage.setItem("token", keycloak.token);
    }

    console.log(authenticated ? "authenticated" : "not authenticated");
  })
  .catch(function () {
    console.log("failed to initialize Keycloak");
  });
// KeyCloak
