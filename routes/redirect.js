// /routes/redirect.js
const express = require('express')
const Url = require('../schemas/url')
const Visit = require('../schemas/visits')
const router = express.Router()
const path = require('path')

router.get('/:urlID', async (req, res) => {
	const { urlID } = req.params

	try {
		const url = await Url.findOne({ urlID })

		if (!url) {
			return res.sendFile(path.join(__dirname, '..', 'expired.html'))
		}

		const now = new Date()
		if (url.expiresAt && url.expiresAt < now) {
			await Url.deleteOne({ urlID })
			return res.send(html)
		}
		res.redirect(url.originalUrl)
		if (url.UID?.length > 0) {
			const deviceInfo = req.useragent // Contains parsed device info

			// Device details
			const deviceDetails = {
				browser: deviceInfo.browser, // Browser name, e.g., 'Chrome'
				version: deviceInfo.version, // Browser version, e.g., '92.0.4515.131'
				os: deviceInfo.os, // Operating system, e.g., 'Windows 10'
				platform: deviceInfo.platform, // Platform type, e.g., 'Microsoft Windows'
				isMobile: deviceInfo.isMobile, // Boolean for mobile
				isDesktop: deviceInfo.isDesktop, // Boolean for desktop
				isTablet: deviceInfo.isTablet, // Boolean for tablet
				source: req.headers['user-agent'], // Full user-agent string
			}
			const visit = new Visit({
				urlID: url.urlID,
				ipAddress: req.ip,
				userAgent: deviceDetails,
			})
			url.visitCount = url.visitCount + 1
			await url.save()
			await visit.save()
		}
	} catch (err) {
		console.error('Error retrieving URL:', err)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

module.exports = router
