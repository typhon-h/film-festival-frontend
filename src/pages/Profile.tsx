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
                {(timedOut) ? error_timed_out() : ''}
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
            {(timedOut) ? error_timed_out() : ''}
            {(errorFlag) ? error_unexpected() : ''}

            <div className="d-flex flex-column align-items-center align-items-sm-center p-4 placeholder-glow">
                {/* edit button */}
                <div className='d-flex flex-column col-6 align-items-center'>
                    <div className='d-flex flex-column col-12 col-sm-8 col-lg-6 col-xxl-5 align-items-center position-relative'>
                        <div className={'ratio ratio-1x1 border rounded-circle overflow-hidden ' + (userImageLoaded ? '' : 'placeholder')} >
                            <img className={'mx-auto ratio ratio-1x1 ' + ((!userImageLoaded) ? 'placeholder' : '')} src={(userImageLoaded ? userImage : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")} alt="Film Hero" style={{ objectFit: 'cover' }} />
                        </div>
                    </div>

                    {/* edit image buttons */}
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