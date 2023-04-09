import axios from "axios"
import React from "react"
import DirectorCard from "./DirectorCard"

const ReviewsPanel = (props: any) => {
    const [reviews, setReviews] = React.useState<Review[]>([])
    const [timedOut, setTimedOut] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [loading, setLoading] = React.useState(true)


    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimedOut(true)
        }, 1500)

        const getReviews = () => {
            axios.get(process.env.REACT_APP_DOMAIN + "/films/" + props.filmId + "/reviews")
                .then((response) => {
                    setErrorFlag(false)
                    setReviews(response.data)
                    setLoading(false)
                    clearTimeout(timer)
                    setTimedOut(false)
                }, (error) => {
                    console.log(error)

                    if (error.code !== "ERR_NETWORK") {
                        setErrorFlag(true)
                        setErrorMessage(error.response.statusText)
                    }

                    clearTimeout(timer)
                    setTimedOut(false)

                })
        }

        getReviews()
    }, [props.filmId])

    const display_reviews = () => {
        return reviews.map((review, index) =>
            <div key={review.reviewerId} className={'d-flex flex-column border-bottom border-3 col-12 ' + ((index % 2 === 0) ? 'bg-body' : 'bg-light')}>
                {(review.review) ? <span className='w-100 p-2 fs-6 fst-italic text-start border-1 border-bottom'>"{review.review}"</span> : ''}
                <div className='d-flex flex-row justify-content-between align-items-center py-2 px-4'>
                    <span className='col-3 fs-6 text-muted'><span className='fs-1 fw-medium pe-1 text-dark'>{review.rating}</span>/ 10</span>
                    <div className='col-5 border-1'>
                        <DirectorCard director={{ id: review.reviewerId, firstName: review.reviewerFirstName, lastName: review.reviewerLastName }}></DirectorCard>
                    </div>
                </div>
            </div>

        )
    }

    const no_reviews = () => {
        return (
            <span className="text-muted fst-italic">No Reviews Available</span>
        )
    }

    return (
        <div className="d-flex flex-column col-12">
            <div className='d-flex flex-row bg-light border justify-content-between align-items-center py-2 px-3 rounded-top'>
                <span className='fs-3'>User Reviews</span>
                <div className='d-flex flex-column'>
                    <span className='fs-6 fw-light'><span className='fs-3 fw-semibold pe-1'>{props.rating}</span>/ 10</span>
                    <span className='text-muted fs-6'>{reviews.length} review{(reviews.length !== 1) ? 's' : ''}</span>
                </div>
            </div>

            <div className='d-flex flex-column col-12 border'>
                {(reviews.length) ? display_reviews() : no_reviews()}
            </div>
        </div>
    )
}

export default ReviewsPanel