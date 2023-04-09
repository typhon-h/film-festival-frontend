const getBase64 = (file: File, cb: (arg0: string) => void) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result as string)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}


export { getBase64 }