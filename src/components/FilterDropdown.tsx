import React from "react";
import { useSearchParams } from "react-router-dom";

const FilterDropdown = (props: any) => {
    const [searchParams] = useSearchParams();
    const [expanded, setExpanded] = React.useState(false);


    React.useEffect(() => {
        // Re-renders drop down to update button text arrow direction
        return;

    }, [expanded])


    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    const filter = (e: string) => {
        if (!searchParams.getAll(props.queryParam).includes(e)) {
            searchParams.append(props.queryParam, e)
        } else {
            const existing = searchParams.getAll(props.queryParam);
            searchParams.delete(props.queryParam);
            existing.splice(existing.indexOf(e), 1);
            existing.forEach(element => searchParams.append(props.queryParam, element))
        }

        props.updateParams(searchParams)
    }

    const options = () => {
        return props.options.map((opt: FilterOption) =>
            <label role="button" className="form-check mb-2" key={opt.value} htmlFor={'check' + props.queryParam + opt.name}>
                <input role="button" className="form-check-input" checked={searchParams.getAll(props.queryParam).includes(opt.value)} onChange={() => { filter(opt.value) }} type="checkbox" id={'check' + props.queryParam + opt.name} />
                <label role="button" className="form-check-label" htmlFor={'check' + props.queryParam + opt.name}>
                    {opt.name}
                </label>
            </label >
        )
    }

    return (
        <div className='d-flex flex-column w-100'>
            <button onClick={toggleExpanded} className="btn btn-outline-secondary mb-2" id={props.queryParam + "FiltersCollapseButton"} type="button" data-bs-toggle="collapse" data-bs-target={'#' + props.queryParam + 'FiltersCollapse'} aria-controls={props.queryParam + 'FiltersCollapse'}>{props.name} <i className={'bi bi-caret-' + ((expanded) ? 'down' : 'up') + ((searchParams.has(props.queryParam)) ? '-fill' : '')}></i></button>
            <div className="collapse" id={props.queryParam + 'FiltersCollapse'}>
                <ul className="card card-body w-100 p-2" aria-labelledby={props.queryParam + 'FiltersCollapseButton'}>
                    {options()}
                </ul>
            </div>
        </div>

    )

}

export default FilterDropdown