const express = require('express')
const Url = require('../schemas/url')
const User = require('../schemas/user')
const authenticate = require('../middleware/auth')
const validURL = require('../util/validURL')
const base62 = require('../util/base62.js')
const Visit = require('../schemas/visits.js')
const router = express.Router()

const checkRequestedWith = (req, res, next) => {
	if (req.headers['x-requested-with'] !== 'my-frontend') {
		return res.status(403).json({ message: 'Forbidden' })
	}
	next()
}

// Only allow requests with 'x-requested-with' header to pass
//router.use(checkRequestedWith)

// API Route: /api/user
router.get('/user', authenticate, async (req, res) => {
	const { createdAt, lastLoginAt, urlCount, profilePicture, fullName, email, googleId } = req.user
	var urls = await Url.find({ UID: googleId })
	return res.json({
		createdAt,
		lastLoginAt,
		urlCount,
		profilePicture,
		fullName,
		email,
		googleId,
		urls,
	})
})

// API Route: /api/shorten
router.post('/shorten', async (req, res) => {
	let days = parseInt(req.query.days) || 7
	const originalUrl = req.query.url

	if (!req.isAuthenticated() && days > 7) days = 7
	if (days > 60) days = 60
	if (!validURL(originalUrl)) return res.status(400).json({ message: 'Invalid URL' })
	let user = null
	if (req.isAuthenticated()) {
		res.cookie('loggedIn', true, { maxAge: 24 * 60 * 60 * 1000 })
		user = await User.findOne({ googleId: req.user.googleId })
		if (!user) return res.status(401).json({ message: 'Unauthorized access' })
		if (user?.urlCount >= 10)
			return res.status(403).json({
				message: 'URL creation limit reached. Please delete an old URL to create a new one.',
			})
	} else {
		res.clearCookie('loggedIn')
	}
	const urlID = base62.encode(Date.now())
	const url = new Url({
		urlID,
		originalUrl,
		UID: req.user?.googleId || '',
		userEmail: req.user?.email || '',
		expiresAt: Date.now() + days * 24 * 60 * 60 * 1000,
	})
	if (user) {
		user.urlCount += 1
		await user.save()
	}
	await url.save()
	return res.status(200).json({ url: urlID, loggedIn: req.isAuthenticated() })
})

// API Route: /api/delete/:urlID
router.post('/delete/:urlID', authenticate, async (req, res) => {
	const { urlID } = req.params
	try {
		const url = await Url.findOne({ urlID })
		if (!url) {
			return res.status(404).json({ message: 'URL not found' })
		}
		if (url.UID) {
			if (url.UID !== req.user.googleId)
				return res.status(401).json({ message: 'Unauthorized access' })
			const user = await User.findOne({ googleId: req.user.googleId })
			user.urlCount -= 1
			await user.save()
			await Visit.deleteMany({ urlID })
		}

		await Url.deleteOne({ urlID })
		res.status(200).json({ message: 'URL deleted successfully' })
	} catch (error) {
		console.error('Error deleting URL:', error)
		res.status(500).json({ message: 'Server error' })
	}
})

router.get('/visitors/:id', authenticate, async (req, res) => {
	const { id } = req.params
	try {
		const data = await Visit.find({ urlID: id })
		if (data.length === 0) return res.status(404).json({ message: 'URL not found' })
		return res.json(data)
	} catch (error) {
		console.error('Error fetching visitors:', error)
		res.status(500).json({ message: 'Server error' })
	}
})
module.exports = router
