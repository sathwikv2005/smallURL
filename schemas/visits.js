const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema({
	urlID: {
		type: String,
		required: true,
	},
	ipAddress: {
		type: String,
		required: true,
	},
	userAgent: {
		type: Object,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

visitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 })

const Visit = mongoose.model('Visit', visitSchema)
module.exports = Visit
