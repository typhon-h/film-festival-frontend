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
        if ((props.whitelist && !props.whitelist.includes(parseInt(activeUser, 10))) || (!props.whitelist && authenticated && !activeUser)) {
            navigate('/login')
        } else if ((props.blacklist && props.blacklist.includes(parseInt(activeUser, 10))) || (!props.blacklist && !authenticated && activeUser)) {
            navigate('/')
        }
        setAuthChecked(true)
    }, [activeUser, authenticated, navigate, props.blacklist, props.whitelist])


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