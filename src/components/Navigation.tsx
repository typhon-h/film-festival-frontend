import Restricted from "../layouts/Restricted";
import NavLink from "./NavLink";

const Navigation = () => {
    return (
        <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light ">
            <div className="container">
                <a className="navbar-brand" href="/">Film Festival</a>
                <button className="navbar-toggler hidden-lg-up" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                    aria-expanded="false" aria-label="Toggle navigation"><i className="bi bi-list"></i></button>
                <div className="collapse navbar-collapse" id="collapsibleNavId">
                    <div className=' d-flex flex-column align-items-center flex-lg-row justify-content-between col-12'>
                        <ul className="navbar-nav order-0">
                            <NavLink href={'/'}>Home</NavLink>
                            <NavLink href={'/films'}>Films</NavLink>
                        </ul>

                        <form action="/films" className="d-flex flex-column flex-lg-row form-inline my-2 my-lg-0 col-10 col-lg-5 order-2 order-lg-1">
                            <input name="q" className="form-control mb-1 mb-lg-0 me-lg-1" type="search" placeholder="Search Film" aria-label="Search" maxLength={64} />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>

                        <ul className="navbar-nav mt-2 mt-lg-0 order-1 order-lg-2">
                            <Restricted auth={false}>
                                <NavLink href={'/login'}>Login</NavLink>
                            </Restricted>
                        </ul>
                    </div>

                </div>
            </div>
        </nav>
    )
}


export default Navigation;