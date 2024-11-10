import React from 'react'
import { useParams } from 'react-router-dom'
import { LuRefreshCcw } from 'react-icons/lu'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import getCookie from '../util/getCookie'
import Error from '../components/error'
import Login from '../components/login'
import { fetchVisitors, getVisitors } from '../api'
import Visits from './visits'

export default function Visitors({ urlData }) {
	const { id } = useParams()
	const [loading, setLoading] = React.useState(false)
	const [loggedIn, setLoggedIn] = React.useState(false)
	const [visitors, setVisitors] = React.useState(null)
	const [error, setError] = React.useState(null)

	function refreshClickHandler() {
		setError(null)
		setLoading(true)
		callFetchVisitors().then(() => {
			const loginCookie = getCookie('loggedIn')
			if (loginCookie) setLoggedIn(true)
			else setLoggedIn(false)
			setLoading(false)
		})
	}

	async function callFetchVisitors() {
		setLoading(true)
		setError(null)
		const data = await fetchVisitors(id)
		if (data.error) {
			if (data.error === 'Unauthorized access') {
				setError(null)
				setLoggedIn(false)
			} else if (data.error === 'No visitors') {
				setError(null)
				setLoggedIn(false)
				setVisitors(null)
			} else {
				setError(data.error)
			}
			setLoading(false)
			return
		}
		setLoggedIn(true)
		setVisitors(data)
	}

	React.useEffect(() => {
		async function callGetVisitors() {
			setLoading(true)
			setError(null)
			const data = await getVisitors(id)
			if (data.error) {
				if (data.error === 'Unauthorized access') {
					setError(null)
					setLoggedIn(false)
				} else if (data.error === 'No visitors') {
					setError(null)
					setLoggedIn(false)
					setVisitors(null)
				} else {
					setError(data.error)
				}
				setLoading(false)
				return
			}
			setLoggedIn(true)
			setVisitors(data)
		}

		callGetVisitors().then(() => {
			const loginCookie = getCookie('loggedIn')
			if (loginCookie) setLoggedIn(true)
			else setLoggedIn(false)
			setLoading(false)
		})
	}, [])

	return (
		<>
			{error && <Error error={error} />}
			{loading ? (
				<h1 className="sour-gummy home--h1 login">Loading....</h1>
			) : loggedIn ? (
				!error &&
				(visitors ? (
					<Visits visitors={visitors} />
				) : (
					<>
						<div className="visitors--header">
							<h1 className="sour-gummy home--h1 login">No visitors found</h1>{' '}
							<button
								className={`urls--refresh red--btn ${loading && 'loading--btn'}`}
								onClick={refreshClickHandler}
								disabled={loading}
								style={{ height: '50px' }}
							>
								{loading ? (
									<BiDotsHorizontalRounded className="urls--refresh--icon" />
								) : (
									<LuRefreshCcw className="urls--refresh--icon" />
								)}
							</button>
						</div>
					</>
				))
			) : (
				<Login url={`/profile/${id}`} />
			)}
		</>
	)
}
