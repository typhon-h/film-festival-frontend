import axios from "axios"
import React from "react"
import DirectorCard from "./DirectorCard"

const ReviewsPanel = (props: any) => {
    const [reviews, setReviews] = React.useState<Review[]>([])
    const [timedOut, setTimedOut] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [expanded, setExpanded] = React.useState(false);


    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const getReviews = () => {
            axios.get(process.env.REACT_APP_DOMAIN + "/films/" + props.filmId + "/reviews")
                .then((response) => {
                    setErrorFlag(false)
                    setReviews(response.data)
                    clearTimeout(timer)
                    setTimedOut(false)
                }, (error) => {
                    console.log(error)
                    setErrorFlag(true)

                    if (error.code !== "ERR_NETWORK") {

                        setErrorMessage("An error occurred while fetching reviews. Please try again")
                    }

                    clearTimeout(timer)
                    setTimedOut(false)

                })
        }

        getReviews()
    }, [props.filmId])


    React.useEffect(() => {
        // Re-renders drop down to update button text arrow direction
        return;

    }, [expanded])


    const toggleExpanded = () => {
        setExpanded(!expanded);
    }


    const display_reviews = () => {
        return reviews.map((review, index) =>
            <div key={review.reviewerId} className={'d-flex flex-column border-bottom border-3 col-12 ' + ((index % 2 === 0) ? 'bg-body' : 'bg-light')}>
                {(review.review) ? <span className='w-100 p-2 fs-6 fst-italic text-start border-1 border-bottom'>"{review.review}"</span> : ''}
                <div className='d-flex flex-row justify-content-between align-items-center py-2 px-4'>
                    <span className='col-3 fs-6 text-muted'><span className='fs-1 fw-medium pe-1 text-dark'>{review.rating}</span>/ 10</span>
                    <div className='col-8 col-sm-5 col-lg-3 border-1'>
                        <DirectorCard director={{ id: review.reviewerId, firstName: review.reviewerFirstName, lastName: review.reviewerLastName }}></DirectorCard>
                    </div>
                </div>
            </div>

        )
    }

    const render_reviews = () => {

        if (timedOut) { // Should never get here, slow network will be monitored at page level
            return (
                <div className='p-2'>
                    <div className="spinner-border" role="status">
                    </div>
                </div>
            )
        } else if (errorFlag) {
            return (
                <span className="text-muted fst-italic">{errorMessage}</span>
            )
        } else if (reviews.length === 0) {
            return (
                <span className="text-muted fst-italic">No Reviews Available</span>
            )
        } else {
            return display_reviews()
        }
    }


    return (
        <div className="d-flex flex-column col-12">
            <a onClick={toggleExpanded} className='d-flex flex-row bg-light border justify-content-between align-items-center py-2 px-3 rounded-top text-reset text-decoration-none' data-bs-toggle="collapse" href="#userReviews" role="button" aria-expanded="false" aria-controls="userReviews">
                <span className='fs-3'> <i className={'bi bi-caret-' + ((expanded) ? 'down' : 'right')}></i> User Reviews</span>
                <div className='d-flex flex-column'>
                    <span className='fs-6 fw-light'><span className={'fs-3 fw-semibold pe-1 ' + ((props.rating >= 5) ? 'text-success' : 'text-danger')}>{props.rating}</span>/ 10</span>
                    <span className='text-muted fs-6'>{reviews.length} review{(reviews.length !== 1) ? 's' : ''}</span>
                </div>
            </a>

            <div className='collapse' id='userReviews'>
                <div className='d-flex flex-column col-12 border collapse'>
                    {render_reviews()}
                </div>
            </div>
        </div>
    )
}

export default ReviewsPanel