const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('./schemas/user')

module.exports = (app) => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const existingUser = await User.findOne({ googleId: profile.id })
					if (existingUser) {
						existingUser.accessToken = accessToken
						existingUser.refreshToken = refreshToken
						existingUser.lastLoginAt = new Date()
						await existingUser.save()
						return done(null, existingUser)
					} else {
						const newUser = new User({
							googleId: profile.id,
							email: profile.emails[0].value,
							fullName: profile.displayName,
							profilePicture: profile.photos ? profile.photos[0].value : '',
							accessToken: accessToken,
							refreshToken: refreshToken,
							idToken: accessToken,
							urlCount: 0,
						})

						await newUser.save()
						return done(null, newUser)
					}
				} catch (err) {
					return done(err)
				}
			}
		)
	)

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id)
			done(null, user)
		} catch (err) {
			done(err)
		}
	})

	app.use(passport.initialize())
	app.use(passport.session())
}
