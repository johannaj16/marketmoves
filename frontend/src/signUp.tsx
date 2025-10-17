import { useState } from 'react'
import './signUp.css'

function SignUp() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleFNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value)
    };

    const handleLNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value)
    };

    const handleEChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    };

    const handlePNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value)
    };

    const handlePChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    };

    const handleCPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
    };

    const validFields = (
        firstName != '' &&
        lastName != '' &&
        email.includes('@') &&
        password.length >= 8 &&
        password == confirmPassword &&
        phoneNumber.length == 10
    )

    return (
        <div className='signUpDiv'>
            <h2>Sign Up</h2>
            <form>
                <div className='signUpDiv_field'>
                    <label htmlFor='firstName'>First Name</label>
                    <input id='firstName' type='text' value={firstName} onChange={handleFNChange} required />
                </div>

                <div className='signUpDiv_field'>
                    <label htmlFor='lastName'>Last Name</label>
                    <input id='lastName' type='text' value={lastName} onChange={handleLNChange} required />
                </div>

                <div className='signUpDiv_field'>
                    <label htmlFor='email'>Email</label>
                    <input id='email' type='email' value={email} onChange={handleEChange} required />
                    {email != '' && !email.includes('@') && <p>Valid email is required</p>}
                </div>

                <div className='signUpDiv_field'>
                    <label htmlFor='phoneNumber'>Phone Number</label>
                    <input id='phoneNumber' type='tel' value={phoneNumber} onChange={handlePNChange} required />
                    {phoneNumber != '' && phoneNumber.length != 10 && <p>Valid phone number is required</p>}
                </div>

                <div className='signUpDiv_field'>
                    <label htmlFor='password'>Password</label>
                    <input id='password' type='password' value={password} onChange={handlePChange} required />
                    {password != '' && password.length < 8 && <p>Password must be at least 8 characters</p>}
                </div>

                <div className='signUpDiv_field'>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input id='confirmPassword' type='password' value={confirmPassword} onChange={handleCPChange} required />
                    {password !== confirmPassword && <p>Passwords do not match</p>}
                </div>
                <button type='submit' disabled={!validFields}>Create Account</button>
            </form>
        </div>
    )
}

export default SignUp