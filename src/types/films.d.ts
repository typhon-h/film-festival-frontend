type Film = {
    /**
    * Film id as defined by the database
    */
    filmId: number,
    /**
     * Film title as defined when created
     */
    title: string,
    /**
     * Film description as defined when created
     */
    description: string,
    /**
    * Id for genre of the film as defined by the database
    */
    genreId: number,
    /**
     * Id of the user that directed the film
    */
    directorId: number,
    /**
     * First name of the user that directed the film
     */
    directorFirstName: string,
    /**
     * Last name of the user that directed the film
     */
    directorLastName: string,
    /**
    * Date film was released
    */
    releaseDate: string,
    /**
    * Age rating as defined when created
    */
    ageRating: string,
    /**
     * Film runtime as defined when created
     */
    runtime: number,
    /**
     * Average rating across film reviews
     */
    rating: number,
    /**
     * Number of ratings film has received
     */
    numReviews: number,
    /** 
     * Filename of the film image
    */
    image_filename: string
}


type FilmCard = {
    /**
    * Film id as defined by the database
    */
    filmId: number,
    /**
     * Film title as defined when created
     */
    title: string,
    /**
    * Id for genre of the film as defined by the database
    */
    genreId: number,
    /**
     * Id of the user that directed the film
    */
    directorId: number,
    /**
     * First name of the user that directed the film
     */
    directorFirstName: string,
    /**
     * Last name of the user that directed the film
     */
    directorLastName: string,
    /**
    * Date film was released
    */
    releaseDate: string,
    /**
    * Age rating as defined when created
    */
    ageRating: string,
    /**
     * Average rating across film reviews
     */
    rating: number
}

type Genre = {
    /**
     * Id of the genre defined by the database
     */
    genreId: number,
    /**
     * Name of the genre as defined when created
     */
    name: string
}