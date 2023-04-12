import React from 'react';
import { AuthContext } from '../util/Contexts';

// Used for components/page content
// Will load empty if not authorized
const Restricted = (props: any) => {
    const [activeUser] = React.useContext(AuthContext)
    const authenticated = (props.auth === undefined) ? true : props.auth

    if ((props.whitelist && props.whitelist.includes(parseInt(activeUser, 10))) || (!props.whitelist && authenticated && activeUser) || (props.blacklist && !props.blacklist.includes(parseInt(activeUser, 10))) || (!props.blacklist && !authenticated && !activeUser)) {
        return (
            <div>
                {props.children as JSX.Element}
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }


}

export default Restricted;