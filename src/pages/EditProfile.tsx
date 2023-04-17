import { useNavigate } from "react-router-dom";
import { AuthContext, OnlineContext } from "../util/Contexts";
import React from "react";
import axios from "axios";

const EditProfile = () => {
    const navigate = useNavigate();
    const [activeUser] = React.useContext(AuthContext)
    const [userDetails, setUserDetails] = React.useState<User>()
    const [timedOut, setTimedOut] = React.useState(false)
    const [notFoundFlag, setNotFoundFlag] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [isOnline] = React.useContext(OnlineContext)
    const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState<boolean>(false)



    const form = React.useRef<HTMLFormElement>(null)
    const firstName = React.useRef<HTMLInputElement>(null)
    const lastName = React.useRef<HTMLInputElement>(null)
    const email = React.useRef<HTMLInputElement>(null)
    const password = React.useRef<HTMLInputElement>(null)
    const confirmPassword = React.useRef<HTMLInputElement>(null)


    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const getUser = () => {
            setNotFoundFlag(false)
            axios.get(process.env.REACT_APP_DOMAIN + "/users/" + activeUser)
                .then((response) => {
                    setErrorFlag(false)
                    setUserDetails(response.data)
                    if (response.data.email === undefined) {
                        navigate('/logout', { replace: true })
                    }
                    setLoading(false)
                    clearTimeout(timer)
                    setTimedOut(false)
                }, (error) => {
                    console.log(error)

                    if (error.response.status === 404 || error.response.status === 400) {
                        setNotFoundFlag(true)
                        setLoading(false)
                    } else if (error.code !== "ERR_NETWORK") {
                        setErrorFlag(true)
                        setErrorMessage(error.response.statusText)
                    }

                    clearTimeout(timer)
                    setTimedOut(false)

                })
        }

        getUser()
    }, [activeUser, isOnline, navigate])





    return (
        <div>
            {/* {(errorFlag) ?
                <div className="alert alert-danger" role="alert">
                    An unexpected error occurred. Please try again
                </div>
                : ''
            } */}

            {/* {(connectionFlag) ?
                <div className="alert alert-danger" role="alert">
                    Unable to connect to the internet. Please try again
                </div>
                : ''} */}

            <div className='d-flex flex-column col-12 p-3 align-items-center justify-content-center h-100' >

                <div className='mb-3'>
                    <h1>Edit Profile</h1>
                </div>
                {/*   onSubmit={validate}*/}
                <form ref={form} className='d-flex flex-column col-10 col-md-6 ' id='editForm' noValidate>

                    <div className="d-flex flex-column flex-lg-row align-items-start justify-content-lg-between">
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editFName" className="form-label">First Name</label>
                            </div>
                            <input ref={firstName} type="text" className="form-control" value={userDetails?.firstName} id="editFName" maxLength={64} placeholder={'Jane'} aria-describedby={'editFNameInvalid'} autoFocus={true} required />
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end" id='editFNameInvalid'>
                                Please enter a valid first name less than 64 characters
                            </div>

                        </div>
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editLName" className="form-label">Last Name</label>
                            </div>
                            <input ref={lastName} type="text" className="form-control" value={userDetails?.lastName} id="editLName" maxLength={64} placeholder={'Doe'} required />
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                Please enter a valid last name less than 64 characters
                            </div>
                        </div>
                    </div>

                    <div className='d-flex flex-column col-12 align-items-start mb-3'>
                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="editEmail" className="form-label">Email</label>
                        </div>
                        <input ref={email} type="email" className="form-control" value={userDetails?.email} id="editEmail" maxLength={256} placeholder={'jane.doe@email.com'} required />
                        <div className="valid-feedback text-end">
                            Great!
                        </div>
                        <div className="invalid-feedback text-end">
                            {/* {emailError} */}
                        </div>
                    </div>

                    <div className='d-flex flex-column col-12 align-items-start mb-3'>
                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="editPassword" className="form-label">Password</label>
                        </div>

                        <div className="d-flex flex-row col-12 input-group mb-3">
                            <input ref={password} type={(passwordVisible) ? 'text' : 'password'} className="form-control" id="editPassword" minLength={6} maxLength={64} required />
                            <button onClick={() => { setPasswordVisible(!passwordVisible) }} className="btn btn-outline-secondary rounded-end" type="button" id="showPassword" ><i className={"bi bi-eye-" + ((!passwordVisible) ? 'slash-' : '') + "fill"}></i></button>
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                Password must be between 6-64 characters
                            </div>
                        </div>

                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="editPassword" className="form-label">Confirm Password</label>
                        </div>
                        <div className="d-flex flex-row col-12 input-group mb-3">
                            <input ref={confirmPassword} type={(confirmPasswordVisible) ? 'text' : 'password'} className="form-control" id="editConfirmPassword" minLength={6} maxLength={64} required />
                            <button onClick={() => { setConfirmPasswordVisible(!confirmPasswordVisible) }} className="btn btn-outline-secondary rounded-end" type="button" id="showConfirmPassword" ><i className={"bi bi-eye-" + ((!confirmPasswordVisible) ? 'slash-' : '') + "fill"}></i></button>
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                Passwords must match
                            </div>
                        </div>


                    </div>

                    <div className="d-flex flex-column-reverse flex-lg-row justify-content-between">
                        {/* disabled={loading || submitted || !isOnline} */}
                        <button type="button" onClick={() => { navigate('/profile', { replace: true }) }} className="btn btn-outline-secondary col-12 col-lg-5" >Cancel</button>
                        <button type="submit" className="btn btn-primary col-12 col-lg-5 mb-2 mb-lg-0">Update</button>
                    </div>
                </form >
            </div >
        </div >
    )
}

export default EditProfile