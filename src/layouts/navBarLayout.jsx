import { Outlet } from 'react-router-dom'
import NavBar from '../components/navBar'
import React from 'react'

export default function NavBarLayout() {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	)
}
