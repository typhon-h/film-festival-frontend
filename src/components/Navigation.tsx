import { useLocation } from "react-router-dom";

const Navigation = () => {
    const location = useLocation();

    return (
        <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light ">
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

                    <form action="/films" className="d-flex flex-column flex-lg-row form-inline my-2 my-lg-0">
                        <input name="q" className="form-control mb-1 mb-lg-0 me-lg-1" type="search" placeholder="Search Film" aria-label="Search" maxLength={64} />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    )
}


export default Navigation;