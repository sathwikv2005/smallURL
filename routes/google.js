const express = require('express')
const passport = require('passport')

const router = express.Router()

// /auth/google route
router.get(
	'/',
	(req, res, next) => {
		const from = req.query.from || '/'

		// Store the `from` URL in a cookie
		res.cookie('redirectTo', from, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 5 * 60 * 60 * 1000,
		})
		next()
	},
	passport.authenticate('google', { scope: ['email', 'profile'] })
)

// /auth/google/callback route
router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
	const redirectTo =
		req.cookies.redirectTo && req.cookies.redirectTo.startsWith('/') ? req.cookies.redirectTo : '/'
	res.clearCookie('redirectTo')
	res.cookie('loggedIn', true, { maxAge: 24 * 60 * 60 * 1000 })
	res.redirect(redirectTo)
})

module.exports = router
