import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();
    return (
        <div>
            {/* {(errorFlag) ?
                <div className="alert alert-danger" role="alert">
                    An unexpected error occurred. Please try again
                </div>
                : ''
            }

            {(connectionFlag) ?
                <div className="alert alert-danger" role="alert">
                    Unable to connect to the internet. Please try again
                </div>
                : ''} */}

            <div className='d-flex flex-column col-12 p-3 align-items-center justify-content-center h-100' >

                <div className='mb-3'>
                    <h1>Edit Profile</h1>
                </div>
                {/* ref={form}  onSubmit={validate}*/}
                <form className='d-flex flex-column col-10 col-md-6 ' id='editForm' noValidate>

                    <div className="d-flex flex-column flex-lg-row align-items-start justify-content-lg-between">
                        <div className='d-flex flex-column col-12 col-lg-5 align-items-start mb-3'>
                            <div className='d-flex flex-row col-12 justify-content-between'>
                                <label htmlFor="editFName" className="form-label">First Name</label>
                                <span className='fs-6 text-muted'>required</span>
                            </div>
                            {/* ref={firstName} */}
                            <input type="text" className="form-control" id="editFName" maxLength={64} placeholder={'Jane'} aria-describedby={'editFNameInvalid'} autoFocus={true} required />
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
                                <span className='fs-6 text-muted'>required</span>
                            </div>
                            {/* ref={lastName} */}
                            <input type="text" className="form-control" id="editLName" maxLength={64} placeholder={'Doe'} required />
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
                            <span className='fs-6 text-muted'>required</span>
                        </div>
                        {/* ref={email} */}
                        <input type="email" className="form-control" id="editEmail" maxLength={256} placeholder={'jane.doe@email.com'} required />
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
                            <span className='fs-6 text-muted'>required</span>
                        </div>

                        <div className="d-flex flex-row col-12 input-group mb-3">
                            {/* ref={password} type={(passwordVisible) ? 'text' : 'password'} */}
                            <input className="form-control" id="editPassword" minLength={6} maxLength={64} required />
                            {/* onClick={() => { setPasswordVisible(!passwordVisible) }} + ((!passwordVisible) ? 'slash-' : '')*/}
                            <button className="btn btn-outline-secondary rounded-end" type="button" id="showPassword" ><i className={"bi bi-eye-" + "fill"}></i></button>
                            <div className="valid-feedback text-end">
                                Great!
                            </div>
                            <div className="invalid-feedback text-end">
                                Password must be between 6-64 characters
                            </div>
                        </div>

                        <div className='d-flex flex-row col-12 justify-content-between'>
                            <label htmlFor="editPassword" className="form-label">Confirm Password</label>
                            <span className='fs-6 text-muted'>required</span>
                        </div>
                        <div className="d-flex flex-row col-12 input-group mb-3">
                            {/* ref={password} type={(passwordVisible) ? 'text' : 'password'} */}
                            <input className="form-control" id="editConfirmPassword" minLength={6} maxLength={64} required />
                            {/* onClick={() => { setPasswordVisible(!passwordVisible) }} ((!passwordVisible) ? 'slash-' : '') +*/}
                            <button className="btn btn-outline-secondary rounded-end" type="button" id="showConfirmPassword" ><i className={"bi bi-eye-" + "fill"}></i></button>
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
        </div>
    )
}

export default EditProfile