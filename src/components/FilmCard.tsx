import axios from "axios";
import React from "react";
import { Buffer } from "buffer";

const FilmCard = (film: FilmCard) => {

    const [genre, setGenre] = React.useState<Genre>({ genreId: 0, name: "Unknown" });
    const [heroImage, setHeroImage] = React.useState<Image>({ data: "", type: "" });
    const [directorImage, setDirectorImage] = React.useState<Image>({ data: "", type: "" });


    React.useEffect(() => {
        getGenres()
        getHeroImage()
        getDirectorImage()
    })

    const getGenres = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/genres')
            .then((response) => {
                setGenre(response.data.filter((g: Genre) => g.genreId === film.genreId)[0]);
            }, (error) => {
                // Genre has default value from useState
            })
    }

    const getHeroImage = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/' + film.filmId + '/image', { responseType: "arraybuffer" })
            .then((response) => {
                setHeroImage({ data: Buffer.from(response.data, 'binary').toString('base64'), type: response.headers['content-type'] });
            }, (error) => {
                // Image not found
            })
    }

    const getDirectorImage = () => {
        axios.get((process.env.REACT_APP_DOMAIN as string) + '/users/' + film.directorId + '/image', { responseType: "arraybuffer" })
            .then((response) => {
                setDirectorImage({ data: Buffer.from(response.data, 'binary').toString('base64'), type: response.headers['content-type'] });
            }, (error) => {
                // Image not found
            })
    }



    return (
        <a href={'/films/' + film.filmId} className="card d-flex w-25 overflow-hidden text-decoration-none text-dark">
            <img className="card-img-top img-thumbnail img-fluid" src={`data:${heroImage.type};base64,${heroImage.data}`} alt="Hero" />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title display">{film.title}</h5>

                <div className="d-flex flex-row justify-content-around">
                    <div className="d-flex flex-column">
                        <div className="mb-3">
                            <p className="card-text mb-1 fw-bold">Classification</p>
                            <p className="card-text">{film.ageRating}</p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold">Avg. Rating</p>
                            <p className="card-text">{film.rating}</p>
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        <div className="mb-3">
                            <p className="card-text mb-1 fw-bold">Genre</p>
                            <p className="card-text">{genre.name}</p>
                        </div>

                        <div>
                            <p className="card-text mb-1 fw-bold">Release Date</p>
                            <p className="card-text">{film.releaseDate}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="d-flex flex-row align-items-center justify-content-around mt-auto mb-auto">
                    <div className="ratio ratio-1x1 rounded-circle border overflow-hidden" style={{ width: '20%' }}>
                        <img className="object-fit-cover mx-auto" src={`data:${directorImage.type};base64,${directorImage.data}`} alt="Director Icon" />
                    </div>
                    <p className="mb-0">{film.directorFirstName}</p>
                    <p className="mb-0">{film.directorLastName}</p>
                </div>

            </div>
        </a >







        // <div className="d-flex flex-column w-25 overflow-hidden border">
        //     <div className="">
        //         <img className="w-50" src="https://seng365.csse.canterbury.ac.nz/api/v1/films/1/image" alt="" />
        //         <p>Title</p>
        //     </div>
        //     <div className="d-flex flex-row ">
        //         <img className="w-25" src="https://seng365.csse.canterbury.ac.nz/api/v1/users/1/image" alt="" />
        //         <p>First Name</p>
        //         <p>Last Name</p>
        //     </div>
        //     <div>
        //         <p>PG</p>
        //         <p>6.33</p>
        //         <p>Release Date</p>
        //         <p>Action</p>
        //     </div>
        // </div>
    )
}

export default FilmCard