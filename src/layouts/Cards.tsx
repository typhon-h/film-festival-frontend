const Cards = ({ children }: any) => {
    return (
        <div className="d-flex flex-row flex-wrap justify-content-center justify-content-sm-between px-5">
            {children}
        </div>
    )
}

export default Cards;