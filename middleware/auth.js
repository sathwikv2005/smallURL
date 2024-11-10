module.exports = (req, res, next) => {
	if (!req.isAuthenticated()) {
		const protocol = req.protocol
		const host = req.get('host')
		res.clearCookie('loggedIn')
		const fullUrl = `${protocol}://${host}${req.originalUrl}`
		return res
			.status(401)
			.json({ message: 'Unauthorized access', callBack: fullUrl + '/auth/google/callback' })
	}
	res.cookie('loggedIn', true, { maxAge: 24 * 60 * 60 * 1000 })
	next()
}
