type Image = {
    /**
     * Binary representation of the image.
     */
    data: string,
    /**
     * filetype of the image
     */
    type: string
}

type FilterOption = {
    /**
     * Name to be displayed as filter option
     */
    name: string,
    /**
     * Value to be passed to query param
     */
    value: string
}

type PageInfo = {
    /**
     * Starting offset of page
     */
    startIndex: number,
    /**
     * Results per page
     */
    count: number
}