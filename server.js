//TODO server react build files
//TODO google api config to production
//TODO Change html meta tags
//TODO Change README.md
require('dotenv').config()
const express_secret = process.env.EXPRESS_SESSION_SECRET
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const port = process.env.PORT || 9000
const apiRoutes = require('./routes/api')
const logoutRoutes = require('./routes/logout')
const loginRoutes = require('./routes/login')
const googleRoutes = require('./routes/google')
const redirectRoutes = require('./routes/redirect')
const mongodb = require('./mongo')
const session = require('express-session')
const passportConfig = require('./passportConfig')
const MongoStore = require('connect-mongo')
const useragent = require('express-useragent')
const path = require('path')

app.use(express.static(path.join(__dirname, 'build')))

app.use(express.json())
app.use(
	session({
		secret: express_secret,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
	})
)
app.use(cookieParser())
app.use(useragent.express())
passportConfig(app)

app.use('/auth/google', googleRoutes)
app.use('/logout', logoutRoutes)

app.use('/r', redirectRoutes) // Use the redirect route for /r/:urlID

app.use('/api', apiRoutes)

app.use('/login', loginRoutes)

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(port, async () => {
	await mongodb()
	console.log(`Server online on http://localhost:${port}`)
})