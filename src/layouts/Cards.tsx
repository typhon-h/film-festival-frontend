const Cards = ({ children }: any) => {
    return (
        <div className="d-flex flex-row flex-wrap justify-content-between overflow-auto m-2">
            <main>{children}</main>
        </div>
    )
}

export default Cards;