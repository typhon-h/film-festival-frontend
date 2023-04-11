import { useLocation } from "react-router-dom";

const NavLink = (props: any) => {
    const location = useLocation();


    return (
        <li className="nav-item">
            <a className={'nav-link ' + (location.pathname === props.href ? 'active' : '')} href={props.href} aria-current="page">{props.children}</a>
        </li>
    )
}

export default NavLink