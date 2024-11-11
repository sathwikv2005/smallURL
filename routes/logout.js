const express = require('express')
const User = require('../schemas/user')

const router = express.Router()

router.get('/', async (req, res) => {
	if (req.isAuthenticated()) {
		try {
			// Delete the user data from MongoDB based on user id stored in session
			await User.findByIdAndDelete(req.user.id)

			// Destroy the session
			req.session.destroy(req.sessionID, (err) => {
				if (err) {
					return res.status(500).json({ error: 'Failed to log out' })
				}
				res.clearCookie('loggedIn')
				res.redirect('/')
			})
		} catch (err) {
			console.error('Error deleting user from database:', err)
			return res.status(500).json({ error: 'Error deleting user from database' })
		}
	} else {
		res.redirect('/')
	}
})

module.exports = router
