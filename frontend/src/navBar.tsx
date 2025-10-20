import { useState } from 'react'
import logo from './assets/logo.png'
import './navBar.css'

function NavBar() {
    return (
        <div className='header'>
            <img src={logo} />
            <h3>marketmoves</h3>
            <ul className='nav'>
                <li>Dashboard</li>
                <li>Trade</li>
                <li>Leaderboard</li>
                <li>Portfolio</li>
                <li>Contact</li>
                <li>Link</li>
            </ul>
            <ul className='profile'>
                <li>Sign in</li>
                <li>Register</li>
            </ul>
        </div>
    )
}

export default NavBar;