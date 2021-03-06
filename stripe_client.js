'use strict';

StripeOAuth.requestCredential = function(options, credentialRequestCompleteCallback) {

  if (!credentialRequestCompleteCallback && typeof options === "function") {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({ service: "stripe" });
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;
  }

  var credentialToken = Random.id();
  var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  var display = mobile ? "touch" : "popup";
  var scope = "";

  if (options && options.requestPermissions) {
    scope = options.requestPermissions.join(",");
  }

  const redirectUrl = Meteor.absoluteUrl('_oauth/stripe?close');

  var loginUrl =
    'https://connect.stripe.com/oauth/authorize' +
    '?response_type=code' +
    '&client_id=' + config.appId +
    '&scope=' + config.scope +
    '&stripe_landing=login' +
    '&redirect_uri=' + redirectUrl +
    '&state=' + OAuth._stateParam('popup', credentialToken);

  var dimensions = { width: 650, height: 560 };
  Oauth.initiateLogin(credentialToken, loginUrl, credentialRequestCompleteCallback, dimensions);

};
