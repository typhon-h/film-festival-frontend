import React from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import FilterDropdown from "./FilterDropdown";

const excludedQueries = ['q'];


const useFiltersActive = () => {
    const [searchParams] = useSearchParams();


    for (const q of excludedQueries) {
        searchParams.delete(q)
    }

    const numQueries = Array.from(searchParams.keys()).length;

    return numQueries > 0
}


const Filters = (props: any) => {

    const [searchParams] = useSearchParams();
    const [genres, setGenres] = React.useState<Genre[]>([]);

    React.useEffect(() => {
        const getGenre = () => {
            axios.get((process.env.REACT_APP_DOMAIN as string) + '/films/genres')
                .then((response) => {
                    setGenres(response.data)
                }, (error) => {
                    console.log(error)
                    // Genre has default value from useState
                })
        }

        getGenre()
    }, [])

    const clearFilters = () => {
        Array.from(searchParams.keys()).forEach((q) => {
            if (!excludedQueries.includes(q)) {
                searchParams.delete(q)
            }
        })

        props.updateParams(searchParams)
    }

    return (
        <div className="d-flex flex-row justify-content-end me-5 mb-2">
            <button className="btn btn-primary col-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#filters" aria-controls="filters"><i className="bi bi-funnel"></i> Filter</button>

            <div className="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabIndex={-1} id="filters" aria-labelledby="filtersLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    <h5 className="offcanvas-title col-12" id="filtersLabel">Filters</h5>
                </div>
                <div className="offcanvas-body d-flex flex-column">
                    <button type="button" className="btn btn-outline-warning mb-5" disabled={!useFiltersActive()} onClick={clearFilters}><i className="bi bi-x"></i> Remove Filters</button>

                    <div className="d-flex flex-column align-items-start">

                        <FilterDropdown name='Genre' queryParam='genreIds' options={genres.map((g: Genre) => { return { name: g.name, value: g.genreId.toString() } })} updateParams={props.updateParams} />

                        <FilterDropdown name='Age Rating' queryParam='ageRatings' options={['TBC', 'G', 'PG', 'M', 'R13', 'R16', 'R18'].map((r: string) => { return { name: r, value: r } })} updateParams={props.updateParams} />

                    </div>
                </div>
            </div >
        </div >
    )

}

export { useFiltersActive }
export default Filters