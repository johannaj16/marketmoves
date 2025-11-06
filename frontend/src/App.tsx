import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/logo.png'

import './App.css'
import SignUp from './signUp'
import SignIn from './signIn'
import Dashboard from './portfolioDashboard'

function App() {
  const [tab, setTab] = useState('SignUp')

  return (
    <BrowserRouter>
      <nav className='header'>
        <img src={logo} />
        <h3>marketmoves</h3>
        <ul className='nav'>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/trade">Trade</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
          <li><Link to="/portfolio">Portfolio</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/link">Link</Link></li>
        </ul>
        <ul className='profile'>
          <li><Link to="/signIn">Sign in</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/signIn' element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App
