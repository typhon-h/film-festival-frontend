import axios, { AxiosResponse } from "axios"
import React from "react"
import { AuthContext, OnlineContext } from "../util/Contexts"
import { useNavigate } from "react-router-dom"


const login = (email: string | undefined, password: string | undefined, success: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>> | void) | null | undefined, error: ((reason: any) => PromiseLike<never> | void) | null | undefined) => {
    axios.post(process.env.REACT_APP_DOMAIN + `/users/login`,
        {
            email: email,
            password: password
        })
        .then(success, error)
}

const Login = () => {
    const [, setActiveUser] = React.useContext(AuthContext)
    const [errorFlag, setErrorFlag] = React.useState<boolean>(false)
    const [connectionFlag, setConnectionFlag] = React.useState<boolean>(false)
    const [isOnline] = React.useContext(OnlineContext)
    const [submitted, setSubmitted] = React.useState<boolean>(false)
    const navigate = useNavigate();

    const form = React.useRef<HTMLFormElement>(null)
    const email = React.useRef<HTMLInputElement>(null)
    const password = React.useRef<HTMLInputElement>(null)
    const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)


    const validate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        email.current?.classList.remove('is-valid')
        email.current?.classList.remove('is-invalid')

        password.current?.classList.remove('is-valid')
        password.current?.classList.remove('is-invalid')

        if (!form.current?.checkValidity()) {
            form.current?.classList.add('was-validated')
            setSubmitted(false)
        } else {
            form.current?.classList.remove('was-validated')
            setSubmitted(true)
        }
    }


    React.useEffect(() => {
        if (!submitted) {
            return
        }

        login(email.current?.value, password.current?.value,
            (response) => {
                setActiveUser(response.data.userId)
                axios.defaults.headers.common = {
                    'x-authorization': response.data.token
                }
                localStorage.setItem('activeUser', response.data.userId)
                localStorage.setItem('token', response.data.token)
                navigate("/films");
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

    }, [setActiveUser, submitted])

    return (
        <div className='d-flex flex-column col-12 p-3 align-items-center justify-content-center h-100'>
            {(connectionFlag || !isOnline) ?
                <div className="alert alert-danger col-12" role="alert">
                    Unable to connect to the internet. Please try again
                </div>
                : ''}
            <div className='mb-3'>
                <h1>Login</h1>
                <span className='text-secondary'>Not registered? <a href='/register' className="text-primary text-decoration-none">Create a new account</a></span>
            </div>

            <form ref={form} className='d-flex flex-column col-10 col-md-4' id='loginForm' onSubmit={validate} noValidate>

                <div className='d-flex flex-column col-12 align-items-start mb-3'>
                    <div className='d-flex flex-row col-12 justify-content-between'>
                        <label htmlFor="loginEmail" className="form-label">Email</label>
                        <span className='fs-6 text-muted'>required</span>
                    </div>
                    <input ref={email} type="email" className="form-control" id="loginEmail" maxLength={256} autoFocus={true} required />
                    <div className="invalid-feedback text-end">
                        Must be a valid email
                    </div>
                </div>

                <div className='d-flex flex-column col-12 align-items-start mb-1'>
                    <div className='d-flex flex-row col-12 justify-content-between'>
                        <label htmlFor="loginPassword" className="form-label">Password</label>
                        <span className='fs-6 text-muted'>required</span>
                    </div>

                    {/* Possible issue with divs when displaying error messages */}
                    <div className="d-flex flex-row col-12 input-group mb-1">
                        <input ref={password} type={(passwordVisible) ? 'text' : 'password'} className="form-control" id="loginPassword" aria-describedby="loginPasswordFeedback" maxLength={64} required />
                        <button className="btn btn-outline-secondary rounded-end" type="button" id="showPassword" onClick={() => { setPasswordVisible(!passwordVisible) }}><i className={"bi bi-eye-" + ((!passwordVisible) ? 'slash-' : '') + "fill"}></i></button>
                        <div className="invalid-feedback text-end" id='loginPasswordFeedback'>
                            This is a required field
                        </div>
                    </div>

                </div>
                <div className={'text-danger flex-row col-12 justify-content-center mb-2 ' + ((errorFlag) ? 'visible' : 'invisible')}>Incorrect email or password</div>
                <div className="d-flex flex-column-reverse flex-lg-row justify-content-between">
                    <button type="reset" className="btn btn-outline-secondary col-12 col-lg-5">Clear</button>
                    <button type="submit" className="btn btn-primary col-12 col-lg-5 mb-2 mb-lg-0">Login</button>
                </div>
            </form >
        </div >
    )
}

export { login }
export default Login