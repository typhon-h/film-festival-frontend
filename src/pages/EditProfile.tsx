import { useNavigate } from "react-router-dom";
import { AuthContext, OnlineContext } from "../util/Contexts";
import React from "react";
import axios from "axios";
import NotFound from "./NotFound";

const EditProfile = () => {
    const navigate = useNavigate();
    const [activeUser] = React.useContext(AuthContext)
    const [userDetails, setUserDetails] = React.useState<User>()
    const [submitted, setSubmitted] = React.useState<boolean>(false)
    const [timedOut, setTimedOut] = React.useState(false)
    const [notFoundFlag, setNotFoundFlag] = React.useState(false)
    const [connectionFlag, setConnectionFlag] = React.useState<boolean>(false)
    const [isOnline] = React.useContext(OnlineContext)
    const [loading, setLoading] = React.useState(true)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [emailError, setEmailError] = React.useState<string>("Please enter a valid email")
    const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)
    const [newPasswordVisible, setNewPasswordVisible] = React.useState<boolean>(false)
    const [expanded, setExpanded] = React.useState<boolean>(false)



    const form = React.useRef<HTMLFormElement>(null)
    const firstName = React.useRef<HTMLInputElement>(null)
    const lastName = React.useRef<HTMLInputElement>(null)
    const email = React.useRef<HTMLInputElement>(null)
    const password = React.useRef<HTMLInputElement>(null)
    const newPassword = React.useRef<HTMLInputElement>(null)



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


    const validate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        firstName.current?.classList.remove('is-valid')
        firstName.current?.classList.remove('is-invalid')

        lastName.current?.classList.remove('is-valid')
        lastName.current?.classList.remove('is-invalid')

        email.current?.classList.remove('is-valid')
        email.current?.classList.remove('is-invalid')

        password.current?.classList.remove('is-valid')
        password.current?.classList.remove('is-invalid')

        newPassword.current?.classList.remove('is-valid')
        newPassword.current?.classList.remove('is-invalid')

        if (!form.current?.checkValidity()) {
            form.current?.classList.add('was-validated')
            setSubmitted(false)
        } else {
            if (password.current?.value && !newPassword.current?.value) {
                form.current?.classList.remove('was-validated')
                newPassword.current?.classList.remove('is-invalid')
                newPassword.current?.classList.add('is-invalid')
                setSubmitted(false)
            } else {
                form.current?.classList.remove('was-validated')
                setSubmitted(true)
            }

        }
    }





    React.useEffect(() => {
        if (!submitted) {
            return
        }

        setConnectionFlag(false)

        const edit = () => {
            axios.patch(process.env.REACT_APP_DOMAIN + `/users/${activeUser}`, {
                ...(firstName.current?.value !== userDetails?.firstName && { firstName: firstName.current?.value }),
                ...(lastName.current?.value !== userDetails?.lastName && { lastName: lastName.current?.value }),
                ...(email.current?.value !== userDetails?.email && { email: email.current?.value }),
                ...(password.current?.value !== "" && { currentPassword: password.current?.value }),
                ...(newPassword.current?.value !== "" && { password: newPassword.current?.value }),
            }).then((response) => {
                navigate('/profile', { replace: true })
            }, (err) => {
                console.log(err)
                setSubmitted(false)

                if (err.code === 'ERR_NETWORK') {
                    setConnectionFlag(true)
                    return
                }

                switch (err.response.status) {
                    case 401:
                        if ((err.response.statusText as string).includes('currentPassword')) {
                            password.current?.classList.remove('is-valid')
                            password.current?.classList.add('is-invalid')
                            newPassword.current?.classList.remove('is-invalid')
                            newPassword.current?.classList.remove('is-valid')
                        } else {
                            navigate('/logout', { replace: true })
                        }
                        break
                    case 400:
                        firstName.current?.classList.add(((err.response.statusText as string).includes('data/firstName')) ? 'is-invalid' : 'is-valid')
                        lastName.current?.classList.add(((err.response.statusText as string).includes('data/lastName')) ? 'is-invalid' : 'is-valid')
                        email.current?.classList.add(((err.response.statusText as string).includes('data/email')) ? 'is-invalid' : 'is-valid')
                        setEmailError('Please enter a valid email')
                        password.current?.classList.add(((err.response.statusText as string).includes('currentPassword')) ? 'is-invalid' : 'is-valid')
                        newPassword.current?.classList.add(((err.response.statusText as string).includes('data/password')) ? 'is-invalid' : 'is-valid')
                        break;
                    case 403:
                        if ((err.response.statusText as string).toLowerCase().includes('exists')) { //TODO: Morgan API does not check for this??
                            email.current?.classList.add('is-invalid')
                            setEmailError('Email already in use')
                        } else if ((err.response.statusText as string).toLowerCase().includes('same')) {
                            newPassword.current?.classList.add('is-invalid')
                        } else {
                            navigate('/logout', { replace: true })
                        }
                        break
                    case 404:
                        navigate('/logout', { replace: true })
                        break
                    default:
                        setErrorFlag(true)
                        setErrorMessage(err.response.statusText)
                        break
                }
            })
        }

        edit()
    }, [activeUser, navigate, submitted, userDetails])

    React.useEffect(() => {
        // Re-renders drop down to update button text arrow direction
        return;

    }, [expanded])

    const error_offline = () => {
        return (
            <div className="alert alert-danger" role="alert">
                We are having trouble connecting to the internet. Check your network settings or click <a href={window.location.href} className="alert-link">here</a> to try again.
            </div>
        )
    }

    const error_timed_out = () => {
        return (
            <div className="alert alert-warning" role="alert">
                Slow network connection. Please check your network or wait while we process your request
            </div>
        )
    }

    const error_unexpected = () => {
        return (
            <div className="alert alert-danger" role="alert">
                {errorMessage}
            </div>
        )
    }

    if (notFoundFlag) {
        return <NotFound />
    }

    const toggleExpanded = () => {
        setExpanded(document.getElementById('changePasswordToggle')?.ariaExpanded === 'true');
    }

    const passwordsMatch = () => {
        if (password?.current?.value && newPassword.current?.value) {
            if (password?.current?.value === newPassword.current?.value) {
                newPassword.current?.classList.add('is-invalid')
            } else {
                newPassword.current?.classList.remove('is-invalid')
            }
        }
    }

    return (
        <div className='d-flex flex-column col-12'>

            {(errorFlag) ? error_unexpected() : ''}
            {(timedOut && isOnline) ? error_timed_out() : ''}
            {(connectionFlag || !isOnline) ? error_offline() : ''}

            <div className={"spinner-border position-absolute align-self-center " + (((loading && isOnline) || submitted) ? 'd-flex' : 'd-none')} style={{ width: '4rem', height: '4rem', top: '40%' }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>

            <div className={'d-flex flex-column col-12 p-3 align-items-center justify-content-center h-100 ' + ((loading || submitted || !isOnline) ? 'opacity-25' : '')} >

                <div className='mb-3'>
                    <h1>Edit Profile</h1>
                </div>

                <form ref={form} className='d-flex flex-column col-10 col-md-6' onSubmit={validate} id='editForm' noValidate>

                    <div className="d-flex flex-column flex-lg-row align-items-start justify-content-lg-between">
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editFName" className="form-label">First Name</label>
                            </div>
                            <input ref={firstName} type="text" className="form-control" defaultValue={userDetails?.firstName} id="editFName" maxLength={64} aria-describedby={'editFNameInvalid'} autoFocus={true} required disabled={loading || submitted || !isOnline} />
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
                            <input ref={lastName} type="text" className="form-control" defaultValue={userDetails?.lastName} id="editLName" maxLength={64} required disabled={loading || submitted || !isOnline} />
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
                        <input ref={email} type="email" className="form-control" defaultValue={userDetails?.email} id="editEmail" maxLength={256} required disabled={loading || submitted || !isOnline} />
                        <div className="valid-feedback text-end">
                            Great!
                        </div>
                        <div className="invalid-feedback text-end">
                            {emailError}
                        </div>
                    </div>


                    <button onClick={toggleExpanded} id="changePasswordToggle" className="btn text-primary mb-3 text-start fs-4 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#changePassword" aria-expanded="false" aria-controls="changePassword">
                        <i className={'bi bi-caret-' + ((expanded) ? 'down' : 'right')}></i> Change Password
                    </button>
                    <div className='collapse' id="changePassword">
                        <div className='d-flex flex-column col-12 align-items-start mb-3 '>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editPassword" className="form-label">Current Password</label>
                            </div>

                            <div className="d-flex flex-row col-12 input-group mb-3">
                                <input ref={password} onChange={passwordsMatch} type={(passwordVisible) ? 'text' : 'password'} className="form-control" id="editPassword" minLength={6} maxLength={64} />
                                <button onClick={() => { setPasswordVisible(!passwordVisible) }} className="btn btn-outline-secondary rounded-end" type="button" id="showPassword" ><i className={"bi bi-eye-" + ((!passwordVisible) ? 'slash-' : '') + "fill"}></i></button>
                                <div className="valid-feedback text-end">
                                    Great!
                                </div>
                                <div className="invalid-feedback text-end">
                                    Password must match your current password
                                </div>
                            </div>

                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editPassword" className="form-label">New Password</label>
                            </div>
                            <div className="d-flex flex-row col-12 input-group mb-3">
                                <input ref={newPassword} onChange={passwordsMatch} type={(newPasswordVisible) ? 'text' : 'password'} className="form-control" id="editNewPassword" minLength={6} maxLength={64} />
                                <button onClick={() => { setNewPasswordVisible(!newPasswordVisible) }} className="btn btn-outline-secondary rounded-end" type="button" id="showNewPassword" ><i className={"bi bi-eye-" + ((!newPasswordVisible) ? 'slash-' : '') + "fill"}></i></button>
                                <div className="valid-feedback text-end">
                                    Great!
                                </div>
                                <div className="invalid-feedback text-end">
                                    Required, must be 6-64 characters, and cannot be the same as your current password
                                </div>
                            </div>


                        </div>
                    </div>


                    <div className="d-flex flex-column-reverse flex-lg-row justify-content-between">
                        <button type="button" onClick={() => { navigate('/profile', { replace: true }) }} className="btn btn-outline-secondary col-12 col-lg-5" disabled={loading || submitted || !isOnline}>Cancel</button>
                        <button type="submit" className="btn btn-primary col-12 col-lg-5 mb-2 mb-lg-0" disabled={loading || submitted || (!isOnline)}>Update</button>
                    </div>
                </form >
            </div >
        </div >
    )
}

export default EditProfile