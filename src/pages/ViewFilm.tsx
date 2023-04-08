
const ViewFilm = () => {

    return (
        <div className="d-flex flex-column align-items-start p-4">
            <h1 className='fs-1 text-secondary align-self-center'>Title</h1>
            <div className='d-flex flex-column align-self-center'>
                <img className='img-fluid img-thumbnail' src="https://seng365.csse.canterbury.ac.nz/api/v1/films/1/image" alt="Film Hero" />
            </div>
            <p className="d-inline-block w-100 text-dark text-truncate text-break"><b>Description: </b> syl;kjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkjskjsdflkj</p>
            <div className='d-flex flex-column w-100'>
                <p className='align-self-start fw-bold'>Director:</p>
                <div className={'d-flex flex-row align-items-center justify-content-around bg-light rounded-3'}>
                    <div className={'ratio ratio-1x1 rounded-circle border overflow-hidden '} style={{ minWidth: '20%', maxWidth: '20%' }}>
                        <img className={'mx-auto '} src='https://seng365.csse.canterbury.ac.nz/api/v1/users/1/image' alt="Director Icon" style={{ objectFit: 'cover' }} />
                    </div>
                    <p className="mb-0">FirstName</p>
                    <p className="mb-0">LastName</p>
                </div>
            </div>

            <div className='d-flex flex-column bg-light w-100 border rounded-3 p-3 my-3'>
                <h3 className='fs-4 text-decoration-underline'>Details</h3>
                <div className='d-flex flex-column justify-content-start'>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Genre:</p>
                        <p className='col-5 text-start'>Action</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Age Rating:</p>
                        <p className='col-5 text-start'>PG</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Runtime:</p>
                        <p className='col-5 text-start'>1h 30m</p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <p className='col-5 text-end'>Release Date:</p>
                        <p className='col-5 text-start'>22/22/2222</p>
                    </div>
                </div>
            </div>

            <div className='w-100 d-flex flex-column'><span className='col-12 bg-warning'>REVIEWS</span></div>

        </div >
    )

}

export default ViewFilm