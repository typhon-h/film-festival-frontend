import React from "react"

const Pagination = (props: any) => {
    const allowedPageSizes = [5, 6, 7, 8, 9, 10]

    const [page, setPage] = React.useState<PageInfo>({ startIndex: 0, count: allowedPageSizes.at(-1) as number })
    const [activePage, setActivePage] = React.useState(1)
    const [allPages, setAllPages] = React.useState<number[]>([])

    const updateActivePage = (page: number) => {
        if (page > allPages.length) {
            setActivePage(allPages.at(-1) as number)
        } else if (page < 1) {
            setActivePage(1)
        } else {
            setActivePage(page)
        }
    }


    React.useEffect(() => {
        setActivePage(1)
        setAllPages(Array.from(Array(Math.ceil(props.numFilms / page.count)).keys()).map(p => p + 1))
    }, [props.numFilms, page.count])

    React.useEffect(() => {
        setPage({ startIndex: (activePage - 1) * page.count, count: page.count })
    }, [activePage, page.count])

    React.useEffect(() => {
        props.updatePage(page)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])



    const pageItems = () => {
        const numPageButtons = 5

        let shownPages;
        if (numPageButtons > allPages.length) {
            shownPages = allPages
        } else if (activePage <= Math.ceil(numPageButtons / 2)) {
            shownPages = allPages.slice(0, numPageButtons)
        } else if (activePage > allPages.length - Math.floor(numPageButtons / 2)) {
            shownPages = allPages.slice(numPageButtons * -1, allPages.length)
        } else {
            shownPages = allPages.slice(activePage - Math.ceil(numPageButtons / 2), activePage + Math.floor(numPageButtons / 2))
        }

        return shownPages.map((p) => {
            return (
                <li key={p} role={'button'} onClick={() => { updateActivePage(p) }} className={'page-item ' + ((activePage === p) ? 'active' : '')}><span className="page-link">{p}</span></li>
            )
        })
    }


    if (props.numFilms === 0) {
        return (
            <div></div>
        )
    }

    const pageSizeOptions = () => {
        return allowedPageSizes.map((p) => {
            return (
                <option key={p} value={p}>{p}</option>
            )
        })
    }

    const updatePageSize = (e: string) => {
        if (allowedPageSizes.includes(parseInt(e))) {
            setPage({ startIndex: page.startIndex, count: parseInt(e) })
        }
    }

    const end_of_results = () => {
        return (
            <div>
                <hr />
                <p className="text-secondary">End of Results</p>
            </div>
        )
    }

    // Centering the pagination using janky column alignment - use absolute positioning probably better
    return (
        <div className='d-flex flex-column'>
            {(activePage === allPages.length) ? end_of_results() : ''}
            <div className="d-flex flex-column-reverse flex-md-row">

                <div className='d-flex mx-5 '>
                    <div className="input-group mb-3">
                        <label className="input-group-text" htmlFor="pageSizeSelect">Items Per Page:</label>
                        <select onChange={({ target: { value } }) => updatePageSize(value)} className="form-select col-3" id="pageSizeSelect" defaultValue={page.count}>
                            {pageSizeOptions()}
                        </select>
                    </div>
                </div>


                <nav aria-label="Film Pagination" className="d-flex justify-content-center">
                    <ul className="pagination d-none d-md-flex position-absolute" style={{ left: '50%', transform: 'translate(-50%, 0%)' }}>
                        <li role={((activePage === 1) ? '' : 'button')} onClick={() => { updateActivePage(1) }} className={'page-item ' + ((activePage === 1) ? 'disabled' : '')}>
                            <span className="page-link"><i className="bi bi-skip-start-fill"></i></span>
                        </li>
                        <li role={((activePage === 1) ? '' : 'button')} onClick={() => { updateActivePage(activePage - 1) }} className={'page-item ' + ((activePage === 1) ? 'disabled' : '')}>
                            <span className="page-link"><i className="bi bi-caret-left-fill"></i></span>
                        </li>
                        {pageItems()}
                        <li role={((activePage === allPages.length) ? '' : 'button')} onClick={() => { updateActivePage(activePage + 1) }} className={'page-item ' + ((activePage === allPages.length) ? 'disabled' : '')}>
                            <span className="page-link"><i className="bi bi-caret-right-fill"></i></span>
                        </li>
                        <li role={((activePage === allPages.length) ? '' : 'button')} onClick={() => { updateActivePage(allPages.length) }} className={'page-item ' + ((activePage === allPages.length) ? 'disabled' : '')}>
                            <span className="page-link"><i className="bi bi-skip-end-fill"></i></span>
                        </li>
                    </ul>

                    <div className="d-md-none">
                        <ul className="pagination justify-content-center">

                            {pageItems()}

                        </ul>

                        <ul className="pagination justify-content-center">
                            <li role={((activePage === 1) ? '' : 'button')} onClick={() => { updateActivePage(1) }} className={'page-item ' + ((activePage === 1) ? 'disabled' : '')}>
                                <span className="page-link"><i className="bi bi-skip-start-fill"></i></span>
                            </li>
                            <li role={((activePage === 1) ? '' : 'button')} onClick={() => { updateActivePage(activePage - 1) }} className={'page-item ' + ((activePage === 1) ? 'disabled' : '')}>
                                <span className="page-link"><i className="bi bi-caret-left-fill"></i></span>
                            </li>
                            <li role={((activePage === allPages.length) ? '' : 'button')} onClick={() => { updateActivePage(activePage + 1) }} className={'page-item ' + ((activePage === allPages.length) ? 'disabled' : '')}>
                                <span className="page-link"><i className="bi bi-caret-right-fill"></i></span>
                            </li>
                            <li role={((activePage === allPages.length) ? '' : 'button')} onClick={() => { updateActivePage(allPages.length) }} className={'page-item ' + ((activePage === allPages.length) ? 'disabled' : '')}>
                                <span className="page-link"><i className="bi bi-skip-end-fill"></i></span>
                            </li>
                        </ul>
                    </div>
                </nav >
            </div>

        </div>
    )
}

export default Pagination