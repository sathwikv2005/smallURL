module.exports.encode = (num) => {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let encoded = ''

	while (num > 0) {
		encoded = chars[num % 62] + encoded
		num = Math.floor(num / 62)
	}

	return encoded
}
