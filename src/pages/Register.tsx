import axios from "axios"
import React from "react"
import { useNavigate } from "react-router-dom";
import default_profile_picture from "../assets/default_profile_picture"
import { getBase64 } from "../util/Image";
import { login } from "../util/Authentication";

const Register = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = React.useState<boolean>(false)
    const [emailError, setEmailError] = React.useState<string>("Please enter a valid email")
    const [newUserImage, setNewUserImage] = React.useState<string>("")
    const [active, setActive] = React.useState({ userId: 0, token: '' })
    const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)

    const form = React.useRef<HTMLFormElement>(null)
    const firstName = React.useRef<HTMLInputElement>(null)
    const lastName = React.useRef<HTMLInputElement>(null)
    const email = React.useRef<HTMLInputElement>(null)
    const password = React.useRef<HTMLInputElement>(null)
    const image = React.useRef<HTMLInputElement>(null)

    const validate = () => {
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
                getBase64(image.current.files.item(0) as File, (str64) => {
                    setNewUserImage(str64)
                    setSubmitted(true)
                })
            } else {
                setNewUserImage(default_profile_picture)
                setSubmitted(true)
            }

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
                login(email.current?.value as string, password.current?.value as string, setActive)
            }, (err) => {
                console.log(err)
                setSubmitted(false)

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

        if (!(newUserImage.startsWith('data:image/png') || newUserImage.startsWith('data:image/gif') || newUserImage.startsWith('data:image/jpg') || newUserImage.startsWith('data:image/jpeg'))) {
            image.current?.classList.add('is-invalid');
            setSubmitted(false)

            return
        } else {
            image.current?.classList.add('is-valid');
        }

        register()

    }, [submitted, newUserImage])

    React.useEffect(() => {
        if (!submitted) {
            return
        }
        const postImage = (id: number) => {
            axios.put(process.env.REACT_APP_DOMAIN + `/users/${id}/image`,
                newUserImage, {
                headers: {
                    'Content-Type': newUserImage.split(';')[0].replace('data:', '')
                }
            })
                .then((response) => {
                    navigate('/')
                }, (err) => { //TODO: server side error handling
                    console.log(err)
                })
        }

        postImage(active.userId)

    }, [active, navigate, newUserImage, submitted])

    return (

        <div className='d-flex flex-column col-12 p-3 align-items-center justify-content-center h-100' >

            <h1 className="mb-5">Register</h1>
            <form ref={form} className='d-flex flex-column col-10 col-md-6  ' id='registerForm' noValidate>

                <div className="d-flex flex-column flex-lg-row align-items-start justify-content-lg-between">
                    <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="registerFName" className="form-label">First Name</label>
                            <span className='fs-6 text-muted'>required</span>
                        </div>
                        <input ref={firstName} type="text" className="form-control" id="registerFName" maxLength={64} placeholder={'Jane'} aria-describedby={'registerFNameInvalid'} required />
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
                        <button className="btn btn-outline-secondary" type="button" id="showPassword" onClick={() => { setPasswordVisible(!passwordVisible) }}><i className={"bi bi-eye-" + ((!passwordVisible) ? 'slash-' : '') + "fill"}></i></button>
                    </div>






                    <div className="valid-feedback text-end">
                        Great!
                    </div>
                    <div className="invalid-feedback text-end">
                        Password must be between 6-64 characters
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
                <div className="d-flex flex-column flex-lg-row justify-content-between">
                    <button type="reset" className="btn btn-outline-secondary mb-2 mb-lg-0 col-12 col-lg-5">Clear</button>
                    <button onClick={validate} type="button" className="btn btn-primary col-12 col-lg-5">Submit</button>
                </div>
            </form >
        </div >
    )
}

export default Register