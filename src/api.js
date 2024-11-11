import getCookie from './util/getCookie'

export async function shorten(url, days) {
	days = parseInt(days) || 7
	const res = await fetch('/api/shorten/?url=' + url + '&days=' + days, {
		method: 'POST',
		headers: {
			'X-Requested-With': 'my-frontend',
		},
	})
	if (!res.ok) {
		console.log(res)
		if (res.status === 403) {
			const resData = await res.json()
			return {
				error: resData.message,
			}
		}
		return {
			error: 'Server error',
		}
	}
	const data = await res.json()
	localStorage.removeItem('userData')
	const protocol = window.location.protocol
	const hostname = window.location.hostname
	const port = window.location.port

	const fullUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`
	return {
		url: fullUrl + '/r/' + data.url,
		loggedIn: data.loggedIn,
	}
}

//
export async function getUser() {
	if (getCookie('loggedIn')) {
		const data = localStorage.getItem('userData')
		if (data) return await JSON.parse(data)
	}
	const data = await fetchUser()
	return data
}

//
export async function fetchUser() {
	const res = await fetch('/api/user', {
		method: 'GET',
		headers: {
			'X-Requested-With': 'my-frontend',
		},
	})
	if (!res.ok) {
		console.log(res)
		localStorage.removeItem('userData')
		if (res.status === 401) {
			const resData = await res.json()
			return {
				error: resData.message,
				callBack: resData.callBack,
			}
		}

		return {
			error: 'Server error',
		}
	}
	const data = await res.json()
	localStorage.setItem('userData', JSON.stringify(data))
	return data
}

export async function deleteUrl(urlID) {
	try {
		const res = await fetch('/api/delete/' + urlID, {
			method: 'POST',
			headers: {
				'X-Requested-With': 'my-frontend',
			},
		})
		if (!res.ok) {
			console.log(res)
			if (res.status === 404 || res.status === 401 || res.status === 500) {
				const resData = await res.json()
				return {
					error: resData.message,
				}
			}
			return {
				error: 'Server error',
			}
		}
		const data = await res.json()
		localStorage.removeItem('visitors-' + urlID)
		const user = await getUser()
		const newUrls = user.urls.filter((url) => url.urlID !== urlID)
		user.urls = newUrls
		localStorage.setItem('userData', JSON.stringify(user))

		return {
			success: res.ok,
			loggedIn: data.loggedIn,
		}
	} catch (err) {
		return {
			error: err.message,
		}
	}
}

export async function getUrl(id) {
	const data = await getUser()
	if (data.error) return data
	for (var i = 0; i < data.urls.length; i++) {
		if (data.urls[i].urlID === id) return data.urls[i]
	}
	return {
		error: 'Url not found',
	}
}

export async function getVisitors(id) {
	if (getCookie('loggedIn')) {
		const data = localStorage.getItem('visitors-' + id)
		if (data) return await JSON.parse(data)
	}
	const data = await fetchVisitors(id)
	return data
}

export async function fetchVisitors(id) {
	const res = await fetch('/api/visitors/' + id, {
		method: 'GET',
		headers: {
			'X-Requested-With': 'my-frontend',
		},
	})
	if (!res.ok) {
		localStorage.removeItem('visitors-' + id)
		if (res.status === 401) {
			const resData = await res.json()
			return {
				error: resData.message,
				callBack: resData.callBack,
			}
		}
		if (res.status === 404)
			return {
				error: 'No visitors',
			}

		return {
			error: 'Server error',
		}
	}
	const data = await res.json()
	localStorage.setItem('visitors-' + id, JSON.stringify(data))
	return data
}
