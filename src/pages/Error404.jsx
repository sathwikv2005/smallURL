import { FaHome } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function Error404() {
	const navigate = useNavigate()
	return (
		<div className="error404">
			<h1 className="red--text sour-gummy">Page not found.</h1>
			<button onClick={() => navigate('/')} className="red--btn error404--btn">
				Home
				<FaHome />
			</button>
		</div>
	)
}
