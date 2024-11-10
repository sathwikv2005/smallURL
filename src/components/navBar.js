import { Link } from 'react-router-dom'
import { CgProfile } from 'react-icons/cg'
import React from 'react'
import { getUser } from '../api'
import getCookie from '../util/getCookie'

export default function NavBar() {
	const [loggedIn, setLoggedIn] = React.useState(false)
	const [profilePic, setProfilePic] = React.useState(
		'https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg'
	)

	React.useEffect(() => {
		async function callGetUser() {
			const data = await getUser()
			if (data.error) {
				if (data.error === 'Unauthorized access') {
					setLoggedIn(false)
				}

				return
			}
			setLoggedIn(true)
			setProfilePic(data.profilePicture)
		}
		callGetUser().then(() => {
			const loginCookie = getCookie('loggedIn')
			if (loginCookie) setLoggedIn(true)
			else setLoggedIn(false)
		})
	}, [])

	return (
		<>
			<div className="navbar">
				<div className="navbar--title">
					<Link className="navbar--title--link sour-gummy" to="/">
						Small URL
					</Link>
				</div>
				<div className="nav--right-items inter">
					<Link to="/profile">Tracking</Link>
					<Link to="/profile" className="navbar--profile--a">
						{loggedIn ? (
							<img
								src={profilePic}
								alt="https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"
								className="navbar--profile--gicon"
							/>
						) : (
							<CgProfile className="navbar--profile--icon" />
						)}
					</Link>
				</div>
			</div>
		</>
	)
}
