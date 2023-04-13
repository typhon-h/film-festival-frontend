type film = {
    filmId: number,
    title: string,
    genreId: number,
    releaseDate: string,
    directorId: number,
    directorFirstName: string,
    directorLastName: string,
    rating: number,
    ageRating: string
}

type filmFull = {
    description: string,
    numReviews: number,
    runtime: number
} & film

type filmReturn = {
    films: film[],
    count: number
}

type genre = {
    genreId: number,
    name: string
}

type review = {
    reviewerId: number,
    rating: number,
    review: string,
    reviewerFirstName: string,
    reviewerLastName: string
}

type filmSearchQuery = {
    q?: string,
    directorId?: number,
    reviewerId?: number,
    genreIds?: Array<number>,
    ageRatings?: Array<string>,
    sortBy?: string
    count?: number,
    startIndex?: number
}