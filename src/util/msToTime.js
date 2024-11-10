const msToTime = (ms) => {
	const seconds = Math.floor((ms / 1000) % 60)
	const minutes = Math.floor((ms / (1000 * 60)) % 60)
	const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
	const days = Math.floor(ms / (1000 * 60 * 60 * 24))

	let result = ''
	if (days > 0) result += `${days}d `
	if (hours > 0) result += `${hours}h `
	if (minutes > 0) result += `${minutes}m `
	result += `${seconds}s`

	return result.trim()
}

export default msToTime
