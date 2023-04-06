import React from "react"
import { useSearchParams } from "react-router-dom"

const Sort = (props: any) => {
    const [searchParams] = useSearchParams();
    const [sortAsc, setSortAsc] = React.useState((searchParams.has('sortBy')) ? searchParams.get('sortBy')?.substring(searchParams.get('sortBy')?.lastIndexOf('_') as number).toUpperCase() === 'ASC' : true)
    const [sortBy, setSortBy] = React.useState((searchParams.has('sortBy')) ? searchParams.get('sortBy')?.substring(0, searchParams.get('sortBy')?.lastIndexOf('_')).toUpperCase() : 'RELEASED')

    const sorts = [
        { label: 'Alphabetical', value: 'ALPHABETICAL' },
        { label: 'Rating', value: 'RATING' },
        { label: 'Release Date', value: 'RELEASED' },
    ]

    React.useEffect(() => {
        // Trigger re-render on button press to change visible state


        const updateSort = () => {
            searchParams.delete('sortBy')
            searchParams.set('sortBy', sortBy + '_' + (sortAsc ? 'ASC' : 'DESC'))
            props.updateParams(searchParams)
        }

        updateSort();
        // Removes e-lint warning since hook should not be dependent on props
        // TODO: Find a cleaner solution
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortAsc, sortBy, searchParams])


    const toggleSortDirection = () => {
        setSortAsc(!sortAsc)
    }

    const changeSortBy = (v: string) => { // CHANGING ORDER WORKS FINE - CHANGING STRING LAGS BY 1 (CONSIDER ENUM)
        setSortBy(v)
    }

    const options = () => {
        return sorts.map((sort) => {
            return (
                <option key={sort.value} value={sort.value}>{sort.label}</option>
            )
        })
    }

    return (
        <div className="d-flex col-12 col-md-5 col-lg-4 col-xl-3">
            <div className="input-group mb-3 h-100">
                <label className="input-group-text" htmlFor="sortFilmSelect">Sort by:</label>
                <select onChange={({ target: { value } }) => changeSortBy(value)} defaultValue={sortBy} className="form-select" id="sortFilmSelect" aria-label="Sort Films">
                    {options()}
                </select>
                <button onClick={toggleSortDirection} className="btn btn-outline-secondary" type="button"><i className={'bi bi-arrow-' + ((sortAsc) ? 'down' : 'up')}></i></button>
            </div>
        </div>
    )
}

export default Sort