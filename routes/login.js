const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
	let redirect = req.query.from

	// Only allow redirect if it is a relative path
	if (!redirect || !redirect.startsWith('/')) {
		redirect = '/'
	}

	if (req.isAuthenticated()) {
		if (!req.cookies.loggedIn) res.cookie('loggedIn', true)
		return res.redirect(redirect)
	}

	res.redirect(`/auth/google?from=${encodeURIComponent(redirect)}`)
})

module.exports = router
