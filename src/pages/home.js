import React from 'react'
import { shorten } from '../api'
import getCookie from '../util/getCookie'
import { FaArrowRight } from 'react-icons/fa'

export default function Home() {
	const [loading, setLoading] = React.useState(false)
	const [loggedIn, setLoggedIn] = React.useState(false)
	const [url, setUrl] = React.useState(null)
	const [input, setInput] = React.useState('')
	const [error, setError] = React.useState('')
	const [copied, setCopied] = React.useState(false)
	const [selected, setSelected] = React.useState([true, false, false, false])

	React.useEffect(() => {
		const loginCookie = getCookie('loggedIn')
		if (loginCookie) setLoggedIn(true)
	}, [])

	async function clickHandler(event) {
		event.preventDefault()
		setLoading(true)
		setCopied(false)
		setUrl(null)
		setError('')
		try {
			new URL(input)
			let timeDays = 7
			if (selected[1]) timeDays = 15
			else if (selected[2]) timeDays = 30
			else if (selected[3]) timeDays = 60
			const shortenedUrl = await shorten(input, timeDays)
			if (shortenedUrl.error) return setError(shortenedUrl.error)
			setUrl(shortenedUrl.url)
		} catch (err) {
			console.log(err.message)
			setError('* Please enter a valid URL')
		} finally {
			setLoading(false)
		}
	}

	async function dayHandler(event) {
		const btnId = event.currentTarget.id
		var arr = [false, false, false, false]
		console.log(btnId)
		if (btnId === 'btn1') arr[0] = true
		else if (btnId === 'btn2') arr[1] = true
		else if (btnId === 'btn3') arr[2] = true
		else if (btnId === 'btn4') arr[3] = true
		setSelected(arr)
	}

	function copyToClipboard(event) {
		navigator.clipboard.writeText(url).then(
			() => {
				setCopied(true)
			},
			(err) => {
				setCopied(false)
				console.error('Failed to copy text: ', err)
			}
		)
	}

	function onChangeHandler(event) {
		setCopied(false)
		setUrl(null)
		setError('')
		setInput(event.target.value)
	}

	return (
		<>
			<div className="home">
				<div className="home--shorten">
					<h1 className="home--h1 ubuntu">Shorten your URL</h1>
					<div className="home--form">
						<form onSubmit={clickHandler}>
							<input
								className="home--input sour-gummy"
								placeholder="https://www.example.com"
								value={url || input}
								onChange={onChangeHandler}
							></input>
						</form>
						<div className="home--btn--container">
							<button
								disabled={loading}
								className="home--btn red--btn sour-gummy"
								onClick={url ? copyToClipboard : clickHandler}
							>
								<span className="home--btn--text">
									{loading ? 'Loading..' : url ? (copied ? 'Copied' : 'Copy') : 'Shorten'}
								</span>
								{!loading && !url && <FaArrowRight className="home--arrow" />}
							</button>
						</div>
					</div>
					{error && <div className="home--error error inter">{error}</div>}
					<div className="home--days--h1 sour-gummy">
						<div className="home--days--h1--container">
							Select expiry time:&nbsp;&nbsp;
							{loggedIn ? (
								''
							) : (
								<div className="home--days--h2 ubuntu">
									(Login required to set expiry beyond 7 days.)
								</div>
							)}
						</div>
					</div>
					<div className="home--days">
						<button
							id="btn1"
							className={`home--day ${selected[0] && 'home--day--enabled'}`}
							onClick={dayHandler}
						>
							<span className="home--day--text inter">7 days</span>
						</button>
						<button
							id="btn2"
							className={`home--day ${selected[1] && 'home--day--enabled'}`}
							disabled={!loggedIn}
							onClick={dayHandler}
						>
							<span className="home--day--text inter">15 days</span>
						</button>
						<button
							id="btn3"
							className={`home--day ${selected[2] && 'home--day--enabled'}`}
							disabled={!loggedIn}
							onClick={dayHandler}
						>
							<span className="home--day--text inter">30 days</span>
						</button>
						<button
							id="btn4"
							className={`home--day ${selected[3] && 'home--day--enabled'}`}
							disabled={!loggedIn}
							onClick={dayHandler}
						>
							<span className="home--day--text inter">60 days</span>
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
