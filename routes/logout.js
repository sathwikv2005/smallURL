const express = require('express')
const User = require('../schemas/user')

const router = express.Router()

router.get('/', async (req, res) => {
	res.clearCookie('loggedIn')
	if (req.isAuthenticated()) {
		try {
			await User.findByIdAndDelete(req.user.id)

			req.session.destroy((err) => {
				if (err) {
					console.error('Failed to destroy session:', err)
					return res.status(500).json({ error: 'Failed to log out' })
				}

				return res.redirect('/')
			})
		} catch (err) {
			console.error('Error deleting user from database:', err)
			return res.status(500).json({ error: 'Error deleting user from database' })
		}
	} else {
		return res.redirect('/')
	}
})

module.exports = router
