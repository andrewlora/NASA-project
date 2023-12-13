function httpAuthGoogle(req, res) {
  return res.send('Auth with google');
}
function httpAuthGoogleCallback(req, res) {
  console.log('Google called us back!');
  // return res.redirect();
}
function httpSecret(req, res) {
  return res.send('Your personal secret value is 42!');
}
function httpLogout(req, res) {
  return res.send('Auth with google');
}
function httpFailure(req, res) {
  return res.send('Failed to log in !!!');
}

module.exports = {
  httpAuthGoogle,
  httpAuthGoogleCallback,
  httpSecret,
  httpLogout,
  httpFailure,
};
