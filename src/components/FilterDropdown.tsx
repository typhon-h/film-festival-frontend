import { useSearchParams } from "react-router-dom";
import { useFiltersActive } from "./Filters";

const FilterDropdown = (props: any) => {
    const [searchParams] = useSearchParams();


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
        console.log(searchParams.getAll(props.queryParam))
        return props.options.map((opt: FilterOption) =>
            < div className="form-check mb-2" key={opt.value} >
                <input className="form-check-input" checked={searchParams.getAll(props.queryParam).includes(opt.value)} onChange={() => { filter(opt.value) }} type="checkbox" id={'check' + props.queryParam + opt.name} />
                <label className="form-check-label" htmlFor={'check' + props.queryParam + opt.name}>
                    {opt.name}
                </label>
            </div >
        )
    }

    return (
        <div className='d-flex flex-column w-100'>
            <button className="btn btn-outline-secondary mb-2" id={props.queryParam + "FiltersCollapseButton"} type="button" data-bs-toggle="collapse" data-bs-target={'#' + props.queryParam + 'FiltersCollapse'} aria-expanded="false" aria-controls={props.queryParam + 'FiltersCollapse'}>{props.name} <i className={'bi bi-caret-down' + ((searchParams.has(props.queryParam)) ? '-fill' : '')}></i></button>
            <div className="collapse" id={props.queryParam + 'FiltersCollapse'}>
                <ul className="card card-body w-100 p-2" aria-labelledby={props.queryParam + 'FiltersCollapseButton'}>
                    {options()}
                </ul>
            </div>
        </div>

    )

}





export default FilterDropdown