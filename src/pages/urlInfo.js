import { useParams } from 'react-router-dom'
import React from 'react'
import { getUrl } from '../api'
import Login from '../components/login'
import getCookie from '../util/getCookie'
import Error from '../components/error'
import UrlDetails from '../components/urlDetails'
import Visitors from '../components/visitors'

export default function UrlInfo() {
	const { id } = useParams()
	const [loading, setLoading] = React.useState(false)
	const [loggedIn, setLoggedIn] = React.useState(false)
	const [urlData, setUrlData] = React.useState(null)
	const [error, setError] = React.useState(null)

	React.useEffect(() => {
		async function callGetUrl() {
			const data = await getUrl(id)
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
			setUrlData(data)
		}
		setLoading(true)
		callGetUrl().then(() => {
			const loginCookie = getCookie('loggedIn')
			if (loginCookie) setLoggedIn(true)
			else setLoggedIn(false)
			setLoading(false)
		})
	}, [])
	return (
		<>
			<div className="urlinfo">
				{error && <Error error={error} />}
				{loading ? (
					<h1 className="sour-gummy home--h1 login">Loading....</h1>
				) : loggedIn ? (
					!error && (
						<>
							<UrlDetails urlData={urlData} />
							<Visitors urlData={urlData} />
						</>
					)
				) : (
					<Login url={`/profile/${id}`} />
				)}
			</div>
		</>
	)
}
