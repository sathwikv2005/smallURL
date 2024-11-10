import { LuRefreshCcw } from 'react-icons/lu'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import React from 'react'
import { fetchVisitors } from '../api'
import { useNavigate, useParams } from 'react-router-dom'
import Error from './error'
import formatDateTime from '../util/formatDateTime'

export default function Visits({ visitors }) {
	const { id } = useParams()
	const navigate = useNavigate()
	console.log(visitors)
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState(null)
	const [visits, setVisits] = React.useState(visitors)

	function refreshClickHandler() {
		setError(null)
		setLoading(true)
		callFetchVisitors().then(() => {
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
				navigate('/profile')
			} else if (data.error === 'No visitors') {
				setError(null)

				setVisits(null)
			} else {
				setError(data.error)
			}
			setLoading(false)
			return
		}

		setVisits(data)
	}

	return (
		<>
			{error && <Error error={error} />}
			<div className="visitors">
				<div className="visitors--header">
					<div className="visitors--h1 red--text sour-gummy">Visitors:</div>
					<button
						className={`urls--refresh red--btn ${loading && 'loading--btn'}`}
						onClick={refreshClickHandler}
						disabled={loading}
					>
						{loading ? (
							<BiDotsHorizontalRounded className="urls--refresh--icon" />
						) : (
							<LuRefreshCcw className="urls--refresh--icon" />
						)}
					</button>
				</div>
				{visits.length > 0 && (
					<div className="visits">
						{visits.map((visit) => {
							return (
								<div key={visit._id} id={visit._id} className="visit">
									<div className="visit--left visit--inner">
										<div className="visit--time">
											<span className="visit--category sour-gummy">Time stamp: </span>
											{formatDateTime(visit.createdAt).join(', ')}
										</div>
										<div className="visit--device">
											<span className="visit--category sour-gummy">Device: </span>
											{visit.userAgent.platform}
										</div>
									</div>
									<div className="visit--right visit--inner">
										<div className="visit--browser">
											<span className="visit--category sour-gummy">Browser: </span>
											{visit.userAgent.browser}
										</div>
										<div className="visit--ip">
											<span className="visit--category sour-gummy">IP address: </span>
											{visit.ipAddress}
										</div>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</>
	)
}
