import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'
import NavBarLayout from './layouts/navBarLayout'
import Profile from './pages/profile'
import UrlInfo from './pages/urlInfo'
import Error404 from './pages/Error404'

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<NavBarLayout />}>
				<Route index element={<Home />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/profile/:id" element={<UrlInfo />} />
				<Route path="*" element={<Error404 />} />
			</Route>
		</Routes>
	)
}
