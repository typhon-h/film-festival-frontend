import DirectorCardPlaceholder from "../../components/placeholder/DirectorCardPlaceholder"
import ReviewsPanelPlaceholder from "../../components/placeholder/ReviewsPanelPlaceholder"

const ViewFilmPlaceholder = (props: any) => {

    const film_details = () => {
        return (
            <div className='d-flex flex-column justify-content-center bg-light col-12 col-sm-5 col-lg-12 col-xxl-3 border rounded-3 p-3 my-sm-0 my-3 me-xxl-5'>
                {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
                <h3 className='fs-4 text-decoration-underline col-4 placeholder align-self-center'></h3>
                <div className='d-flex flex-column justify-content-start'>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'><span className='placeholder col-6'></span></p>
                        <p className={'col-5 text-start '}><span className='placeholder col-5'></span></p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'><span className='placeholder col-8'></span></p>
                        <p className='col-5 text-start'><span className='placeholder col-2'></span></p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'><span className='placeholder col-6'></span></p>
                        <p className='col-5 text-start'><span className='placeholder col-6'></span></p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'><span className='placeholder col-8'></span></p>
                        <p className='col-5 text-start'><span className='placeholder col-6'></span></p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="d-flex flex-column align-items-start align-items-sm-center p-4 placeholder-glow">
            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
            <h1 className='fs-1 text-secondary align-self-center mb-3 col-5 placeholder'></h1>
            <div className='d-flex flex-column col-12 flex-lg-row flex-xxl-column align-items-center justify-content-lg-between justify-content-xxl-center'>
                <div className='d-flex flex-column col-12 col-sm-10 col-lg-4 col-xxl-3 mb-3 align-items-center me-xxl-5'>
                    <div className='d-flex flex-column align-self-center col-12 col-sm-10 col-lg-12 mb-3 mb-sm-0'>
                        <img className='img-fluid img-thumbnail placeholder' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=" alt="Film Hero" />
                    </div>
                </div>
                <div className='d-flex flex-column flex-sm-row-reverse flex-lg-column flex-xxl-row-reverse col-12 col-lg-7 col-xxl-12 justify-content-sm-around justify-content-xxl-center align-items-center m-sm-3 mt-lg-0'>
                    <div className='d-flex flex-column col-12 col-sm-6 col-lg-12 col-xxl-4'>
                        <div className="d-flex flex-column text-start mb-4">
                            <span className="d-inline-block col-2 placeholder mb-2"></span>
                            <span className="d-inline-block col-5 placeholder mb-1"></span>
                            <span className="d-inline-block col-5 placeholder col-7"></span>

                        </div>

                        <div className='d-flex flex-column col-12 col-md-8 col-lg-5 col-xl-5 col-xxl-6 mb-3'>
                            <p className='align-self-start fw-bold col-3 placeholder'></p>
                            <div className='bg-light rounded-3'>
                                <DirectorCardPlaceholder />
                            </div>
                        </div>
                    </div>

                    {film_details()}
                </div>
            </div>
            <div className='d-flex flex-column col-12 col-xxl-8'>
                <ReviewsPanelPlaceholder />
            </div>
        </div >
    )

}

export default ViewFilmPlaceholder