import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from "./authcontext";
import logo from './assets/logo.png';
import './navBar.css';

function NavBar() {
    //const { user } = useAuth();
    const user = { email: 'hokie_dev@vt.edu' }; //simulates a user already logged in. Delete line when done
    const [isOpen, setIsOpen] = useState(false);
    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete your account?");
        if (confirmed) {
            console.log("Delete logic for Supabase Edge Function will go here.");
        }
    };
    return (
        <div className='header'>
            <div className='nav-left'>
                <img src={logo} alt="logo" />
                <h3>marketmoves</h3>
            </div>

            { user && (
                <ul className='nav'>
                    <li><Link to="/portfolio">Dashboard</Link></li>
                    <li><Link to="/leaderboard">Leaderboard</Link></li>
                    <li><Link to="/portfolio">Portfolio</Link></li>
                    <li><Link to="/trade-page">Trade</Link></li>
                </ul>
            )}

            <ul className='profile'>
                {user ? (
                    <li className="dropdown-container">
                        <span 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="welcome-text"
                        >
                            Welcome, {user.email?.split('@')[0]}
                        </span>

                        {isOpen && (
                            <ul className="dropdown-menu">
                                <li className="dropdown-item">
                                    <button className="menu-btn" onClick={() => console.log("Logout")}>
                                        Logout
                                    </button>
                                </li>
                                <li className="dropdown-item">
                                    <button className="menu-btn delete-btn" onClick={handleDelete}>
                                        Delete Account
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                ) : (
                    <>
                        <li><Link to="/">Sign in</Link></li>
                        <li><Link to="/signup">Register</Link></li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default NavBar;

    // return (
    //     <div className='header'>
    //         <img src={logo} />
    //         <h3>marketmoves</h3>
    //         <ul className='nav'>
    //             <li><Link to="/portfolio">Dashboard</Link></li>
    //             <li><Link to="/leaderboard">Leaderboard</Link></li>
    //             <li><Link to="/portfolio">Portfolio</Link></li>
    //         </ul>
    //         <ul className='profile'>
    //             <li><Link to="/">Sign in</Link></li>
    //             <li><Link to="/signup">Register</Link></li>
    //         </ul>
    //     </div>
    // );
// }


