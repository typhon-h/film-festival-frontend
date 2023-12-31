import axios from "axios"
import React from "react"
import { useNavigate } from "react-router-dom";
import { login } from "./Login";
import { AuthContext, OnlineContext } from "../util/Contexts";

const Register = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = React.useState<boolean>(false)
    const [emailError, setEmailError] = React.useState<string>("Please enter a valid email")
    const [newUserImage, setNewUserImage] = React.useState<File>()
    const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)
    const [errorFlag, setErrorFlag] = React.useState<boolean>(false)
    const [connectionFlag, setConnectionFlag] = React.useState<boolean>(false)
    const [isOnline] = React.useContext(OnlineContext)
    const [activeUser, setActiveUser] = React.useContext(AuthContext)
    const [user, setUser] = React.useState<number>(0);

    const form = React.useRef<HTMLFormElement>(null)
    const firstName = React.useRef<HTMLInputElement>(null)
    const lastName = React.useRef<HTMLInputElement>(null)
    const email = React.useRef<HTMLInputElement>(null)
    const password = React.useRef<HTMLInputElement>(null)
    const image = React.useRef<HTMLInputElement>(null)

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

        image.current?.classList.remove('is-valid')
        image.current?.classList.remove('is-invalid')

        if (!form.current?.checkValidity()) {
            form.current?.classList.add('was-validated')
            setEmailError('Please enter a valid email')
            setSubmitted(false)
        } else {
            form.current?.classList.remove('was-validated')
            if (image.current?.files?.item(0)) {
                setNewUserImage(image.current?.files?.item(0) as File)
            }

            setSubmitted(true)

        }
    }


    React.useEffect(() => {
        if (!submitted) {
            return
        }

        const register = () => {
            axios.post(process.env.REACT_APP_DOMAIN + '/users/register',
                {
                    firstName: firstName.current?.value,
                    lastName: lastName.current?.value,
                    email: email.current?.value,
                    password: password.current?.value
                }
            ).then((response) => {
                login(email.current?.value as string, password.current?.value as string,
                    (response) => {
                        setUser(response.data.userId)
                        axios.defaults.headers.common = {
                            'x-authorization': response.data.token
                        }
                        localStorage.setItem('activeUser', response.data.userId)
                        localStorage.setItem('token', response.data.token)
                    }, (err) => {
                        console.log(err)
                        setSubmitted(false)
                        if (err.code === 'ERR_NETWORK') {
                            setConnectionFlag(true)
                            setErrorFlag(false)
                        } else {
                            setConnectionFlag(false)
                            setErrorFlag(true)
                        }
                    })

                if (!newUserImage) {
                    navigate('/')
                }
            }, (err) => {
                console.log(err)
                setSubmitted(false)

                if (err.code === 'ERR_NETWORK') {
                    setConnectionFlag(true)
                    return
                }

                switch (err.response.status) {
                    case 403:
                        email.current?.classList.remove('is-valid')
                        email.current?.classList.add('is-invalid')
                        setEmailError('Email already exists');
                        break;
                    case 400:
                        firstName.current?.classList.add(((err.response.statusText as string).includes('data/firstName')) ? 'is-invalid' : 'is-valid')
                        lastName.current?.classList.add(((err.response.statusText as string).includes('data/lastName')) ? 'is-invalid' : 'is-valid')
                        password.current?.classList.add(((err.response.statusText as string).includes('data/password')) ? 'is-invalid' : 'is-valid')
                        email.current?.classList.add(((err.response.statusText as string).includes('data/email')) ? 'is-invalid' : 'is-valid')
                        setEmailError('Please enter a valid email');
                        break;
                }
            })
        }

        if (newUserImage && !(newUserImage.type === 'image/png' || newUserImage.type === 'image/gif' || newUserImage.type === 'image/jpg' || newUserImage.type === 'image/jpeg')) {
            image.current?.classList.add('is-invalid');
            setSubmitted(false)

            return
        } else {
            image.current?.classList.add('is-valid');
        }

        register()

    }, [submitted, newUserImage, setActiveUser, navigate])

    React.useEffect(() => {
        if (!submitted || !user) {
            return
        }
        const postImage = (id: number) => {
            axios.put(process.env.REACT_APP_DOMAIN + `/users/${id}/image`,
                newUserImage, {
                headers: {
                    'Content-Type': newUserImage?.type
                }
            })
                .then((response) => {
                    setActiveUser(user)
                    navigate('/films')
                }, (err) => { //TODO: Redirect user profile
                    console.log(err)
                    navigate('/films')
                })
        }

        postImage(user)

    }, [user, navigate, newUserImage, setActiveUser, submitted, activeUser])

    return (
        <div>
            {(errorFlag) ?
                <div className="alert alert-danger" role="alert">
                    An unexpected error occurred. Please try again
                </div>
                : ''
            }

            {(connectionFlag || !isOnline) ?
                <div className="alert alert-danger" role="alert">
                    Unable to connect to the internet. Please try again
                </div>
                : ''}

            <div className='d-flex flex-column col-12 p-3 align-items-center justify-content-center h-100' >

                <div className='mb-3'>
                    <h1>Register</h1>
                    <span className='text-secondary'>Already registered? <a href='/login' className="text-primary text-decoration-none">Log in</a></span>
                </div>

                <form ref={form} className='d-flex flex-column col-10 col-md-6 ' onSubmit={validate} id='registerForm' noValidate>

                    <div className="d-flex flex-column flex-lg-row align-items-start justify-content-lg-between">
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="registerFName" className="form-label">First Name</label>
                                <span className='fs-6 text-muted'>required</span>
                            </div>
                            <input ref={firstName} type="text" className="form-control" id="registerFName" maxLength={64} placeholder={'Jane'} aria-describedby={'registerFNameInvalid'} autoFocus={true} required />
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end" id='registerFNameInvalid'>
                                Please enter a valid first name less than 64 characters
                            </div>

                        </div>
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="registerLName" className="form-label">Last Name</label>
                                <span className='fs-6 text-muted'>required</span>
                            </div>
                            <input ref={lastName} type="text" className="form-control" id="registerLName" maxLength={64} placeholder={'Doe'} required />
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
                            <label htmlFor="registerEmail" className="form-label">Email</label>
                            <span className='fs-6 text-muted'>required</span>
                        </div>
                        <input ref={email} type="email" className="form-control" id="registerEmail" maxLength={256} placeholder={'jane.doe@email.com'} required />
                        <div className="valid-feedback text-end">
                            Great!
                        </div>
                        <div className="invalid-feedback text-end">
                            {emailError}
                        </div>
                    </div>

                    <div className='d-flex flex-column col-12 align-items-start mb-3'>
                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="registerPassword" className="form-label">Password</label>
                            <span className='fs-6 text-muted'>required</span>
                        </div>

                        <div className="d-flex flex-row col-12 input-group mb-3">
                            <input ref={password} type={(passwordVisible) ? 'text' : 'password'} className="form-control" id="registerPassword" minLength={6} maxLength={64} required />
                            <button className="btn btn-outline-secondary rounded-end" type="button" id="showPassword" onClick={() => { setPasswordVisible(!passwordVisible) }}><i className={"bi bi-eye-" + ((!passwordVisible) ? 'slash-' : '') + "fill"}></i></button>
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                Password must be between 6-64 characters
                            </div>
                        </div>


                    </div>

                    <div className='d-flex flex-column col-12 align-items-start mb-3'>
                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="registerProfilePicture" className="form-label">Upload Profile Picture</label>
                            <span className='fs-6 text-muted'>optional</span>
                        </div>
                        <input ref={image} type="file" className="form-control" accept="image/png,image/gif,image/jpeg, image/jpg" id="registerProfilePicture" placeholder={'Jane'} />
                        <div className="valid-feedback text-end">
                            Great!
                        </div>
                        <div className="invalid-feedback text-end">
                            File must be one of the following: png, gif, jpeg
                        </div>
                    </div>
                    <div className="d-flex flex-column-reverse flex-lg-row justify-content-between">
                        <button type="reset" className="btn btn-outline-secondary col-12 col-lg-5">Clear</button>
                        <button type="submit" className="btn btn-primary col-12 col-lg-5 mb-2 mb-lg-0">Submit</button>
                    </div>
                </form >
            </div >
        </div>
    )
}

export default Register