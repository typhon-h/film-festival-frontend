import React from "react"
import Restricted from "../layouts/Restricted"
import { AuthContext } from "../util/Contexts"

const Home = () => {
    const [ActiveUser,] = React.useContext(AuthContext)


    return (
        <div className="d-flex flex-column justify-content-center align-items-center position-absolute bottom-50 start-50 translate-middle-x">
            <h1 className="display-1">Film Festival</h1>
            <Restricted auth={false}>
                <span><a href="/register" type="button" className="fs-5 text-decoration-none">Register</a></span>
            </Restricted>


        </div >
    )
}

export default Home