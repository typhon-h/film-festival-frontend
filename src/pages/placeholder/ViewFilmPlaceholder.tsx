
const ViewFilm = (props: any) => {

    const film_details = () => {
        return (
            <div className='d-flex flex-column justify-content-center bg-light col-12 col-sm-5 col-lg-12 col-xxl-3 border rounded-3 p-3 my-sm-0 my-3 me-xxl-5'>
                <h3 className='fs-4 text-decoration-underline'>Details</h3>
                <div className='d-flex flex-column justify-content-start'>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Genre:</p>
                        <p className={'col-5 text-start '}></p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Age Rating:</p>
                        <p className='col-5 text-start'></p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Runtime:</p>
                        <p className='col-5 text-start'></p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Release Date:</p>
                        <p className='col-5 text-start'></p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="d-flex flex-column align-items-start align-items-sm-center p-4">
            <h1 className='fs-1 text-secondary align-self-center mb-3'>title</h1>
            <div className='d-flex flex-column col-12 flex-lg-row flex-xxl-column align-items-center justify-content-lg-between justify-content-xxl-center'>
                <div className='d-flex flex-column col-12 col-sm-10 col-lg-4 col-xxl-3 mb-3 align-items-center me-xxl-5'>
                    <div className='d-flex flex-column align-self-center col-sm-10 col-lg-12 mb-3 mb-sm-0'>
                        <img className='img-fluid img-thumbnail' src='' alt="Film Hero" />
                    </div>
                </div>
                <div className='d-flex flex-column flex-sm-row-reverse flex-lg-column flex-xxl-row-reverse col-12 col-lg-7 col-xxl-12 justify-content-sm-around justify-content-xxl-center align-items-center m-sm-3 mt-lg-0'>
                    <div className='d-flex flex-column col-12 col-sm-6 col-lg-12 col-xxl-4'>
                        <p className="d-inline-block col-12 text-dark text-start text-wrap text-break"><b>Description: </b></p>

                        <div className='d-flex flex-column col-12 col-md-8 col-lg-5 col-xl-5 col-xxl-6 mb-3'>
                            <p className='align-self-start fw-bold'>Director:</p>
                            <div className='bg-light rounded-3'>
                                {/* <DirectorCard director={ } /> */}
                            </div>
                        </div>
                    </div>

                    {film_details()}
                </div>
            </div>
            <div className='d-flex flex-column col-12 col-xxl-8'>
                {/* <ReviewsPanel filmId={filmId} rating={film.rating} /> */}
            </div>
        </div >
    )

}

export default ViewFilm