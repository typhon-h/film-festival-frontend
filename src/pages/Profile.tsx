import { useNavigate } from "react-router-dom";
import { AuthContext, OnlineContext } from "../util/Contexts";
import React from "react";
import axios from "axios";
import NotFound from "./NotFound";
import { Buffer } from 'buffer';
import default_profile_picture from "../assets/default_profile_picture.png";
import ProfilePlaceholder from "./placeholder/ProfilePlaceholder";


const Profile = () => {
    const navigate = useNavigate();
    const [activeUser] = React.useContext(AuthContext);
    const [userDetails, setUserDetails] = React.useState<User>();
    const [userImage, setUserImage] = React.useState("")
    const [userImageLoaded, setUserImageLoaded] = React.useState<boolean>(false)
    const [timedOut, setTimedOut] = React.useState(false)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [notFoundFlag, setNotFoundFlag] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [isOnline] = React.useContext(OnlineContext);
    const [deleteConfirmed, setDeleteConfirmed] = React.useState(false)
    const [newUserImage, setNewUserImage] = React.useState<File>()

    const form = React.useRef<HTMLFormElement>(null)
    const newUserImageUpload = React.useRef<HTMLInputElement>(null)
    const frontEndFeedback = React.useRef<HTMLSpanElement>(null)


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


    React.useEffect(() => {
        const getUserImage = () => {
            axios.get((process.env.REACT_APP_DOMAIN as string) + '/users/' + activeUser + '/image', { responseType: "arraybuffer" })
                .then((response) => {
                    setUserImage(`data: ${response.headers['content-type']}; base64, ${Buffer.from(response.data, 'binary').toString('base64')}`);
                    setUserImageLoaded(true)
                }, (error) => {
                    setUserImage(default_profile_picture);
                    setUserImageLoaded(true);
                })
        }
        if (loading) {
            getUserImage()
        }
    }, [activeUser, isOnline, loading])


    React.useEffect(() => {
        const remove = () => {
            axios.delete(process.env.REACT_APP_DOMAIN + `/users/${activeUser}/image`)
                .then((response) => {
                    navigate(0) // Refresh
                }, (err) => {
                    switch (err.response.status) {
                        case 401:
                        case 403:
                            navigate('/logout', { replace: true }) // Doesn't exist or no permission so user should not be on the page
                            break
                        case 404:
                            setErrorFlag(true)
                            setErrorMessage("No profile picture exists to delete")
                            break
                        default:
                            setErrorFlag(true)
                            setErrorMessage(err.message)
                    }
                    setDeleteConfirmed(false)
                })
        }

        if (deleteConfirmed) {
            remove()
        }

    }, [deleteConfirmed, activeUser, navigate])


    React.useEffect(() => {
        const postImage = () => {
            axios.put(process.env.REACT_APP_DOMAIN + `/users/${activeUser}/image`,
                newUserImage, {
                headers: {
                    'Content-Type': newUserImage?.type
                }
            })
                .then((response) => {
                    navigate(0)
                }, (err) => {
                    switch (err.response.status) {
                        case 400:
                            if (frontEndFeedback.current) {
                                frontEndFeedback.current.classList.replace('d-none', 'd-flex')
                                frontEndFeedback.current.innerText = 'Uploaded image must be png, gif, jpg, or jpeg'
                            }
                            break
                        case 401:
                        case 403:
                        case 404:
                            navigate('/logout', { replace: true }) // Doesn't exist or no permission so user should not be on the page
                            break
                        default:
                            setErrorFlag(true)
                            setErrorMessage(err.response.statusText)
                    }

                })
        }

        if (newUserImage) {
            postImage()
        }

    }, [activeUser, navigate, newUserImage])


    const validate = () => {
        if (form.current?.checkValidity()) {
            if (newUserImageUpload.current?.files?.item(0)) {
                setNewUserImage(newUserImageUpload.current.files.item(0) as File)
            }
        } else {
            if (frontEndFeedback.current) {
                frontEndFeedback.current.classList.replace('d-none', 'd-flex')
                frontEndFeedback.current.innerText = 'Uploaded image must be png, gif, jpg, or jpeg'
            }
        }
    }



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

    if (!isOnline && loading) {
        return (
            <div className="d-flex flex-column">
                {error_offline()}
                <ProfilePlaceholder />
            </div>
        )
    }

    if (loading) {
        return (
            <div className="d-flex flex-column">
                {(timedOut && isOnline) ? error_timed_out() : ''}
                {(errorFlag) ? error_unexpected() : ''}
                <ProfilePlaceholder />
            </div>
        )
    }

    if (!activeUser || notFoundFlag) {
        return (<NotFound />)
    }
    console.log(userDetails)
    return (
        <div>
            {(timedOut && isOnline) ? error_timed_out() : ''}
            {(errorFlag) ? error_unexpected() : ''}

            <div className="d-flex flex-column align-items-center align-items-sm-center p-4 placeholder-glow">
                <div className="d-flex flex-row col-12 justify-content-end">
                    <div className='d-flex flex-row'>
                        <button className={'btn btn-outline-primary'} onClick={() => { navigate('edit') }}>Edit Profile</button>
                    </div>
                </div>
                <div className='d-flex flex-column col-6 align-items-center'>
                    <div className='d-flex flex-column col-12 col-sm-8 col-lg-6 col-xxl-5 align-items-center position-relative'>
                        <div className={'ratio ratio-1x1 border rounded-circle overflow-hidden ' + (userImageLoaded ? '' : 'placeholder')} >
                            <img className={'mx-auto ratio ratio-1x1 ' + ((!userImageLoaded) ? 'placeholder' : '')} src={(userImageLoaded ? userImage : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")} alt="Film Hero" style={{ objectFit: 'cover' }} />
                        </div>

                        <div className="position-absolute bottom-0 end-0 h-25 w-50">
                            {(userImage && userImage !== default_profile_picture) ?
                                <div>
                                    <button className="shadow-lg fs-4 btn btn-danger position-absolute top-50 start-50 translate-middle" type='button' data-bs-toggle='modal' data-bs-target='#deleteProfilePictureModal'><i className="bi bi-trash3"></i></button>
                                    <div className="modal fade" id={'deleteProfilePictureModal'} tabIndex={-1} role="dialog" aria-labelledby={'deleteProfilePictureModelLabel'} aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id={'deleteProfilePictureModelLabel'}>Delete Profile Picture</h5>
                                                    <button type="button" className="btn close" data-bs-dismiss="modal" aria-label="Close">
                                                        <i className="bi bi-x-lg" aria-hidden='true'></i>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    Are you sure that you want to delete the profile picture?
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                                        Close
                                                    </button>
                                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { setDeleteConfirmed(true) }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                ''
                            }

                        </div>
                        <form ref={form} id="change-profile-picture" encType="multipart/form-data" className="position-absolute bottom-0 start-0 h-25 w-50">
                            <label htmlFor="upload-profile-picture" className="shadow-lg fs-4 btn btn-primary position-absolute top-50 start-50 translate-middle"><i className="bi bi-pencil-square"></i></label>
                            <input ref={newUserImageUpload} type="file" name="image" id="upload-profile-picture"
                                onChange={validate}
                                accept="image/svg+xml, image/png, image/jpeg" hidden required />
                        </form>
                    </div>

                    <span ref={frontEndFeedback} className='text-danger mt-2 fw-bold d-none'></span>
                </div>

                <h1 className='fs-1 text-secondary mt-3 mx-auto text-break text-capitalize'>{userDetails?.firstName} {userDetails?.lastName}</h1>

                <div className=''>
                    <span className='fw-bold me-2'>
                        Email:
                    </span>
                    <span>
                        {userDetails?.email}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Profile