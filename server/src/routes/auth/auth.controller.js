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
  req.logout(); // Removes req.user and clears any logged in session
  return res.redirect('/');
}
function httpFailure(req, res) {
  return res.send('Failed to log in !!!');
}

function checkLoggedIn(req, res, next) {
  console.log('Current user is:', req.user);
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({ error: 'You must log in!' });
  }
  next();
}

module.exports = {
  httpAuthGoogle,
  httpAuthGoogleCallback,
  httpSecret,
  httpLogout,
  httpFailure,
  checkLoggedIn,
};
