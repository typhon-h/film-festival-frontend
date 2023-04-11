import React from 'react';
import { AuthContext } from '../util/Contexts';
import { useNavigate } from 'react-router-dom';


// Used for pages
const Protected = (props: any) => {
    const [activeUser] = React.useContext(AuthContext)
    const navigate = useNavigate();
    const authenticated = (props.auth === undefined) ? true : props.auth
    const [authChecked, setAuthChecked] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (authenticated && !activeUser) {
            navigate('/login')
        } else if (!authenticated && activeUser) {
            navigate('/')
        }
        setAuthChecked(true)
    }, [activeUser, authenticated, navigate])


    if (authChecked) {
        return (
            <div>
                <main>{props.children}</main>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }


}

export default Protected;