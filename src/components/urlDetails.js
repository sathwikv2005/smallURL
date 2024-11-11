import React from 'react'
import { BsFillArrowUpRightSquareFill } from 'react-icons/bs'
import { FaCopy, FaArrowLeft } from 'react-icons/fa'
import { GoTrash } from 'react-icons/go'
import { deleteUrl } from '../api'
import formatDateTime from '../util/formatDateTime'
import msToTime from '../util/msToTime.js'
import { useNavigate } from 'react-router-dom'
import Error from './error'

export default function UrlDetails({ urlData }) {
	const id = urlData.urlID
	const navigate = useNavigate()

	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState(null)

	const protocol = window.location.protocol
	const hostname = window.location.hostname
	const port = window.location.port

	const fullUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}/r/${id}`

	const [date, time] = formatDateTime(urlData.createdAt)

	function copyToClipboard(event) {
		navigator.clipboard.writeText(fullUrl).then(
			() => {},
			(err) => {
				console.error('Failed to copy text: ', err)
			}
		)
	}

	function deleteClickHandler(event) {
		setLoading(true)
		setError(null)
		const urlID = id
		console.log('Deleting URL with ID:', urlID)
		deleteUrl(urlID)
			.then((res) => {
				if (res.error) {
					setLoading(false)
					console.log(res.error)
					return setError(res.error)
				}
				navigate(-1, { replace: true })
			})
			.catch((error) => {
				setLoading(false)
				console.error('Unexpected error:', error)
				setError('Unexpected error occurred')
			})
	}

	return (
		<div className="url--d">
			{error && <Error error={error} />}
			<div className="url--h--btns">
				<button
					onClick={() => {
						navigate(-1, { replace: true })
					}}
					className="back--btn red--btn"
				>
					<FaArrowLeft />
				</button>
				<button
					id={id}
					disabled={loading}
					className={`url--btn url--trash red--btn display--block ${loading && 'loading--btn'}`}
					onClick={deleteClickHandler}
				>
					<GoTrash className="url--btn--icon" />
				</button>
			</div>
			<div className="url--d--h1">
				<a
					href={urlData.originalUrl}
					title={urlData.originalUrl}
					target="blank"
					className="url--d--h1--text url--original--link red--text sour-gummy"
				>
					{urlData.originalUrl.split('?')[0]}
					<span className="url--params">
						{urlData.originalUrl.split('?')[1] && `?${urlData.originalUrl.split('?')[1]}`}
					</span>
				</a>
				<a href={urlData.originalUrl} target="blank">
					<button className="url--d--btn">
						<BsFillArrowUpRightSquareFill className="url--black--btn url--d--btn--icon" />
					</button>
				</a>
			</div>
			<div className="url--d--container ubuntu">
				<div className="url--d--smallurl">
					<span className="url--d--category sour-gummy">Small url:</span> {fullUrl}
					<button className="black--btn url--d--copy" onClick={copyToClipboard}>
						<FaCopy />
					</button>
				</div>
				<div className="url--d--time">
					<span className="url--d--category sour-gummy">Created at:</span> {date}, {time}
				</div>
				<div className="url--d--expiry">
					<span className="url--d--category sour-gummy">Expires in:</span>
					{msToTime(urlData.expiresAt - Date.now())}
				</div>
				<div className="url--d--visit--count">
					<span className="url--d--category sour-gummy">Visitors:</span>
					{urlData.visitCount}
				</div>
			</div>
		</div>
	)
}
