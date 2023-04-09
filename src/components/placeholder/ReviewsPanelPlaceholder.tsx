
const ReviewsPanelPlaceholder = (props: any) => {


    return (
        <div className="d-flex flex-column col-12 placeholder-glow">
            <a className='d-flex flex-row bg-light border justify-content-between align-items-center py-2 px-3 rounded-top text-reset text-decoration-none' data-bs-toggle="collapse" href="#userReviews" role="button" aria-expanded="false" aria-controls="userReviews">
                <span className='fs-3 col-2 placeholder'></span>
                <div className='d-flex flex-column col-1'>
                    <span className='fs-6 fw-light col-5 placeholder'></span>
                    <span className='text-muted fs-6 col-12 placeholder'></span>
                </div>
            </a>
        </div>
    )
}

export default ReviewsPanelPlaceholder