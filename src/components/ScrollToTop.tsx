import React from "react";

const ScrollToTop = () => {
    const scrollButton = React.useRef<HTMLDivElement>(null)

    const toggle_return_to_top = () => {
        if (scrollButton.current) {
            if (document.documentElement.scrollTop > 50 || document.body.scrollTop > 50) {
                scrollButton.current.style.display = "flex";
            } else {
                scrollButton.current.style.display = "none";
            }
        }
    }

    window.addEventListener("scroll", toggle_return_to_top)

    return (
        <div ref={scrollButton} className='justify-content-center fixed-bottom m-4 m-md-5' style={{ display: 'none', left: 'auto' }}>
            <span role={'button'} onClick={() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }} className='fs-1 text-info p-0'><i className="bi bi-arrow-up-circle-fill "></i></span>
        </div>
    )
}

export default ScrollToTop