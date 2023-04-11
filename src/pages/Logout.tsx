import React from "react"
import { AuthContext } from "../util/Contexts"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Logout = () => {
    const [, setActiveUser] = React.useContext(AuthContext)
    const [errorFlag, setErrorFlag] = React.useState<boolean>(false)
    const navigate = useNavigate();

    React.useEffect(() => {
        const logout = () => {
            setErrorFlag(false);
            axios.post(process.env.REACT_APP_DOMAIN + "/logout")
                .then((response) => {
                    setActiveUser(null)
                    sessionStorage.removeItem('activeUser')
                    sessionStorage.removeItem('token')
                    axios.defaults.headers.common = {
                        'x-authorization': ''
                    }
                    navigate('/')
                }, (err) => {
                    console.log(err)
                    setErrorFlag(true)
                })
        }

        logout()

    }, [errorFlag, navigate, setActiveUser])

    if (errorFlag) {
        return (
            <div className="alert alert-danger" role="alert">
                An error occurred while logging out. Please try again
            </div>
        )
    }
    return (
        <div></div>
    )
}

export default Logout