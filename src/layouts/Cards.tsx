import React from "react";

const Cards = ({ children }: any) => {
    const arr = React.Children.toArray(children)
    return (
        <div className="d-flex flex-row flex-wrap justify-content-center justify-content-sm-between justify-content-md-start px-5">
            {
                React.Children.map(arr, (child, index) => {
                    return (
                        <div className='d-flex col-12 col-sm-5 col-md-4 col-lg-6 col-xl-4'>
                            {child}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Cards;