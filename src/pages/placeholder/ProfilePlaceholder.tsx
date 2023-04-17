const ProfilePlaceholder = () => {

    return (
        <div className='placeholder-glow'>
            <div className="d-flex flex-column align-items-center align-items-sm-center p-4">
                <div className='d-flex flex-column col-6 align-items-center'>
                    <div className='d-flex flex-column col-12 col-sm-8 col-lg-6 col-xxl-5 align-items-center position-relative'>
                        <div className={'ratio ratio-1x1 border rounded-circle overflow-hidden placeholder'} >
                            <img className={'mx-auto ratio ratio-1x1 placeholder'} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=" alt="Film Hero" style={{ objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>

                <h1 className='fs-1 text-secondary mt-3 mx-auto text-break text-capitalize col-4 placeholder'></h1>

                <div className='d-flex flex-row justify-content-center col-5'>
                    <span className='fw-bold me-2 col-2 placeholder'>
                    </span>
                    <span className='fw-bold me-2 col-5 placeholder'>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProfilePlaceholder