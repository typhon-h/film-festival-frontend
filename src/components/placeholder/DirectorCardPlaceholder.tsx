
const DirectorCardPlaceholder = (props: any) => {

    return (
        <div className={'d-flex flex-row align-items-center justify-content-between py-2 px-3 placeholder-glow'}>
            <div className={'ratio ratio-1x1 rounded-circle border overflow-hidden placeholder'} style={{ minWidth: '20%', maxWidth: '20%' }}>
                <img className={'mx-auto '} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=" alt="Director Icon" style={{ objectFit: 'cover' }} />
            </div>
            <p className="mb-0 col-3"><span className='col-12 placeholder'></span></p>
            <p className="mb-0 col-3"><span className='col-12 placeholder'></span></p>
        </div>
    )
}

export default DirectorCardPlaceholder