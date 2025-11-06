import { useState, type FormEvent, type ChangeEvent } from 'react'
import { supabase } from './supabaseClient'
import NavBar from './navBar'

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import googleIcon from './assets/google_logo.png'
import appleIcon from './assets/apple_icon.svg'
import './signIn.css'

function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [visibility, setVisibility] = useState(false)
    const [signedUp, setSignedUp] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')

    const handleEChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    };

    const handlePChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    };

    const handleVChange = () => {
        setVisibility(!visibility)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('An error occurred: ', error)
        } else {
            setEmail('')
            setPassword('')
        }
    }

    const validFields = (
        email.includes('@') &&
        password.length >= 8
    )

    return (
        <div className='signInDiv'>
            <div className='registration'>
                <h5>Hi there!</h5>
                <p>Welcome back, sign in to your account</p>
                <br />
                <form onSubmit={handleSubmit}>
                    <div className='signInDiv_field'>
                        <input
                            id='email'
                            type='email'
                            value={email}
                            onChange={handleEChange}
                            placeholder='Email'
                            required
                        />
                        {email != '' && !email.includes('@') && <p>Valid email is required</p>}
                    </div>
                    <div className='signInDiv_field'>
                        <input
                            id='password'
                            type={visibility ? 'text' : 'password'}
                            value={password}
                            onChange={handlePChange}
                            placeholder='Password'
                            required
                        />
                        <span className='visibility_toggle' onClick={handleVChange}>
                            {visibility ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                        </span>
                        {password != '' && password.length < 8 && <p>Password must be at least 8 characters</p>}
                    </div>
                    <button type='submit' disabled={!validFields}>Continue</button>
                    <p>Or continue with</p>
                    <div className='continueWith'>
                        <button><div>
                            <img src={googleIcon} />
                            <p>Continue with Google</p>
                        </div></button>
                        <button><div>
                            <img src={appleIcon} />
                            <p>Continue with Apple</p>
                        </div></button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignIn