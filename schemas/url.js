const { type } = require('@testing-library/user-event/dist/type')
const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
	UID: {
		type: String,
	},
	urlID: {
		type: String,
		required: true,
		unique: true,
	},
	originalUrl: {
		type: String,
		required: true,
	},
	userEmail: {
		type: String,
		required: false,
	},
	visitCount: {
		type: Number,
		default: 0,
		required: false,
	},
	expiresAt: {
		type: Number,
		default: () => Date.now() + 60 * 24 * 60 * 60 * 1000,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

urlSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 })

const Url = mongoose.model('Url', urlSchema)
module.exports = Url
