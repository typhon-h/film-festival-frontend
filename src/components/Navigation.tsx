import { useLocation } from "react-router-dom";

const Navigation = () => {
    const location = useLocation();

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                <div className="container">
                    <a className="navbar-brand" href="/">Film Festival</a>
                    <button className="navbar-toggler hidden-lg-up" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                        aria-expanded="false" aria-label="Toggle navigation"><i className="bi bi-list"></i></button>
                    <div className="collapse navbar-collapse" id="collapsibleNavId">
                        <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <a className={'nav-link ' + (location.pathname === '/' ? 'active' : '')} href="/" aria-current="page">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className={'nav-link ' + (location.pathname === '/films' ? 'active' : '')} href="/films" aria-current="page">Films</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </div>)
}


export default Navigation;