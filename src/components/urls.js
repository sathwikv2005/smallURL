import { useNavigate } from 'react-router-dom'
import { FaLink } from 'react-icons/fa'
import { LuRefreshCcw } from 'react-icons/lu'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { MdOutlineMoreHoriz } from 'react-icons/md'
import { GoTrash } from 'react-icons/go'
import React from 'react'
import { deleteUrl, fetchUser } from '../api'
import Login from './login'
import Error from './error'
import msToTime from '../util/msToTime.js'

export default function Urls({ userData }) {
	const [loading, setLoading] = React.useState(false)
	const [loggedIn, setLoggedIn] = React.useState(true)
	const [error, setError] = React.useState(null)
	const [data, setData] = React.useState(userData)

	const navigate = useNavigate()

	function OnClickHandler() {
		navigate('/')
	}

	function deleteClickHandler(event) {
		setLoading(true)
		setError(null)
		const urlID = event.currentTarget.id
		console.log('Deleting URL with ID:', urlID)
		deleteUrl(urlID).then((res) => {
			if (res.error) {
				setLoading(false)
				return setError(res.error)
			}
			refreshClickHandler()
		})
	}

	function refreshClickHandler() {
		setError(null)
		setLoading(true)
		fetchUser().then((res) => {
			if (res.callBack) return setLoggedIn(false)
			if (res.error) {
				setLoading(false)
				return setError(res.error)
			}
			setData(res)
			setLoading(false)
		})
	}

	function infoHandler(event) {
		const urlID = event.currentTarget.id
		navigate('/profile/' + urlID)
	}

	function NoUrls() {
		return (
			<div className="url--no--url">
				<div className="url--no--url inter">No urls to display</div>
				<button className="url--no--url--btn red--btn" onClick={OnClickHandler}>
					Shorten a URL
				</button>
			</div>
		)
	}

	function ListOfUrls() {
		return (
			<div className="url--list">
				{data.urls.map((url, index) => {
					if (parseInt(url.expiresAt) - Date.now() < 0) return
					return (
						<div
							key={url.urlID}
							id={url.urlID}
							onClick={infoHandler}
							className={`url--item ${loading && 'loading'}`}
						>
							<div className="url--left">
								<div className="url--original ">
									<span
										title={url.originalUrl}
										className="red--text sour-gummy url--original--link"
									>
										{index + 1}. {url.originalUrl}
									</span>
								</div>
								<div className="url--des">
									<div className="url--visits ubuntu">visitCount: {url.visitCount || '0'}</div>
									<div className="url--expiry ubuntu">
										Expires In: {msToTime(url.expiresAt - Date.now())}
									</div>
								</div>
							</div>
							<div className="url--right">
								<button
									id={url.urlID}
									disabled={loading}
									className={`url--btn red--btn ${loading && 'loading--btn'}`}
									onClick={(event) => {
										// Stop the event from propagating to the parent div
										event.stopPropagation()
										infoHandler(event)
									}}
								>
									<MdOutlineMoreHoriz className="url--btn--icon" />
								</button>
								<button
									id={url.urlID}
									disabled={loading}
									className={`url--btn url--trash red--btn ${loading && 'loading--btn'}`}
									onClick={(event) => {
										event.stopPropagation()
										deleteClickHandler(event)
									}}
								>
									<GoTrash className="url--btn--icon" />
								</button>
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	return (
		<>
			{error && <Error error={error} />}
			{loggedIn ? (
				<div className="urls">
					<div className="urls--header">
						<div className="urls--text sour-gummy">
							<span className="urls--h1 red--text">{data.fullName}</span>
							<span className="urls--h3 inter">&apos;s</span>
							<span className="urls--h2">&nbsp;&nbsp;URLs&nbsp;</span>{' '}
							<FaLink className="urls--icon" />
						</div>
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
					<div className="url--container">{data.urls.length > 0 ? <ListOfUrls /> : <NoUrls />}</div>
				</div>
			) : (
				<Login url="/profile" />
			)}
		</>
	)
}
