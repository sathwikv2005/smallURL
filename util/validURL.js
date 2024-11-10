module.exports = (str) => {
	try {
		new URL(str)
		return true
	} catch (e) {
		return false
	}
}
