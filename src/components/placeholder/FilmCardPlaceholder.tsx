import DirectorCardPlaceholder from "./DirectorCardPlaceholder";

const FilmCardPlaceholder = () => {

    return (
        <div className={'card d-flex flex-column flex-lg-row justify-content-center align-items-lg-center text-decoration-none text-dark mb-3 col-12 col-sm-5 col-md-4 col-lg-6 col-xl-4 placeholder-glow'}>
            <div className="h-50 col-lg-4 col-xl-4 img-thumbnail placeholder" >
                <img className={'w-100 h-100 invisible'} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=" alt="Hero" style={{ boxSizing: 'border-box' }} />
            </div>

            <div className="card-body d-flex flex-column justify-content-around col-lg-7 col-xl-3">
                <h5 className="card-title display"><span className="col-10 placeholder"></span></h5>

                <div className="d-flex flex-column flex-md-row justify-content-around p-2">
                    <div className="d-flex flex-column mb-3 col-md-5">
                        <div className="mb-3">
                            <p className="card-text mb-1 fw-bold"><span className="col-12 placeholder"></span></p>
                            <p className="card-text"><span className="col-5 placeholder"></span></p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold"><span className="col-10 placeholder"></span></p>
                            <p className="card-text"><span className="col-4 placeholder"></span></p>
                        </div>
                    </div>

                    <div className="d-flex flex-column col-md-5">
                        <div className="mb-3">
                            <p className="card-text mb-1 fw-bold"><span className="col-10 placeholder"></span></p>
                            <p className="card-text"><span className="col-8 placeholder"></span></p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold"><span className="col-10 placeholder"></span></p>
                            <p className="card-text"><span className="col-10 placeholder"></span></p>
                        </div>
                    </div>
                </div>
                <hr />
                <DirectorCardPlaceholder />

            </div>

        </div >





    )
}

export default FilmCardPlaceholder;