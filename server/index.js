const express = require('express')
const { promisify } = require('util')
const bodyParser = require('body-parser')
const passport = require('passport')
const refresh = require('passport-oauth2-refresh')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy
const cookieSession = require('cookie-session')
const NodeCache = require('node-cache')
const morgan = require('morgan')
const configPath = process.env.CONFIG_PATH
                    ? process.env.CONFIG_PATH
                    : '../config/default.json'
 const config = require(configPath)
const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require("path")

const UNAUTHORIZED = 401

const proxyOptions = {
  target: config.statesman.endpoint,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    const parts = path.split("/")
    const filtered = parts.filter(part => part !== 'api')
    let proxyPath = ""
    for (const i in filtered) {
      proxyPath += "/"
      proxyPath += filtered[i]
    }
    return proxyPath
  }
}

const app = express()

app.use(bodyParser.json())
app.use(morgan('tiny'))

//We shall be using session cookies to store idman token
app.use(cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [ 'testkey' ]
}));

// Create a local cache to store authntication information temporarily
// Don't make this too long ... the longer it is the risks are higher
// Too short times, means you will do remote verification more frequently, affecting your app performance
const authCache = new NodeCache({
    stdTTL: 60,
    checkPeriod: 90
})

//Passport oauth2 strategy init. Variables come from config.json
const strategy = new OAuth2Strategy({
    authorizationURL: config.idman.endpoint + '/apis/oauth2/authorize',
    tokenURL: config.idman.endpoint + '/apis/oauth2/token',
    clientID: config.idman.clientId,
    clientSecret: config.idman.secret,
    callbackURL: config.orchid.endpoint + "/callback"
  },
  (accessToken, refreshToken, params, profile, cb) => {
    return cb(null, { accessToken: accessToken, user: params.user })
  }
)

//Same strategy is used for getting token and refreshing it
passport.use('oauth2', strategy)
refresh.use('oauth2', strategy)

// Once user is received from authorise, you can set it in cache
passport.serializeUser((data, cb) => {
    authCache.set(data.accessToken, data.user)
    cb(null, data.accessToken)
})

//Get and return the user, if not present in cache, refresh the token to get the data back
//This will also check the token for validity
passport.deserializeUser((accessToken, cb) => {
    if(!accessToken) {
        return cb(null, null)
    }
    var user = authCache.get(accessToken)
    if(user) {
        return cb(null, user)
    }
    else {
        //Refresh the token
      refresh.requestNewAccessToken(
              'oauth2',
              accessToken,
              (err, accessToken, refreshToken, params) => {
                  if(!err) {
                      authCache.set(accessToken, params.user)
                      return cb(null, params.user)
                  }
                  return cb(null, null)
              })
    }
});

app.use(passport.initialize())
app.use(passport.session())

//Check if request is contains required auth. You can also do roll check here if you want
const checkAuth = (req, res, next) => req.user ? next() : res.status(UNAUTHORIZED).send("Unauthorized")

//This will initiate call to idman server and redirect user to login screen
app.get('/login', passport.authenticate('oauth2'))

//This will receive the token id from idman and make backend call to get token from idman
//It will save token to session cookie to be used in browser
app.get('/callback',
  passport.authenticate(
    'oauth2',
    { 
      successRedirect: '/',
      failureRedirect: '/login'
    }
  )
)

app.use('/api', checkAuth, createProxyMiddleware(proxyOptions))

app.use(express.static(path.join(__dirname, "../build")))

//This is a secure resource
app.get('/*', checkAuth, (req, res) => {
  res.sendFile(path.join("build", "index.html"), {'root': '../'})
})    

const startServer = async () => {
  const port = process.env.SERVER_PORT || 5000
  await promisify(app.listen).bind(app)(port)
  console.log(`Listening on port ${port}`)
}

startServer()
