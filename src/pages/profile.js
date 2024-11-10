import React from 'react'
import { getUser } from '../api'
import Login from '../components/login'
import Urls from '../components/urls'
import getCookie from '../util/getCookie'
import Error from '../components/error'

export default function Profile() {
	const [loading, setLoading] = React.useState(false)
	const [loggedIn, setLoggedIn] = React.useState(false)
	const [userData, setUserData] = React.useState(null)
	const [error, setError] = React.useState(null)

	React.useEffect(() => {
		async function callGetUser() {
			const data = await getUser()
			if (data.error) {
				if (data.error === 'Unauthorized access') {
					setError(null)
					setLoggedIn(false)
				} else {
					setError(data.error)
				}
				setLoading(false)
				return
			}
			setLoggedIn(true)
			setUserData(data)
		}
		setLoading(true)
		callGetUser().then(() => {
			const loginCookie = getCookie('loggedIn')
			if (loginCookie) setLoggedIn(true)
			else setLoggedIn(false)
			setLoading(false)
		})
	}, [])

	return (
		<>
			<div className="profile">
				{error && <Error error={error} />}
				{loading ? (
					<h1 className="sour-gummy home--h1 login">Loading....</h1>
				) : loggedIn ? (
					<Urls userData={userData} />
				) : (
					<Login url="/profile" />
				)}
			</div>
		</>
	)
}
