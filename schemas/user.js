const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	googleId: {
		type: String,
		required: true,
		unique: true,
	}, // Google User ID (unique for each user)

	email: {
		type: String,
		required: true,
		unique: true,
	}, // The user's email address

	fullName: {
		type: String,
		required: true,
	}, // The user's full name

	profilePicture: {
		type: String,
		default: '',
	}, // The URL of the user's profile picture (optional)

	accessToken: {
		type: String,
		required: true,
	}, // Access token for making API calls on behalf of the user

	refreshToken: {
		type: String,
		required: false,
	}, // Refresh token to get a new access token when the current one expires

	idToken: {
		type: String,
		required: true,
	}, // ID token for user authentication

	createdAt: {
		type: Date,
		default: Date.now,
	}, // The date the user signed up (or logged in)

	lastLoginAt: {
		type: Date,
		default: Date.now,
	}, // The date the user last logged in
	urlCount: {
		type: Number,
		default: 0,
	},
})

const User = mongoose.model('User', userSchema)

module.exports = User
