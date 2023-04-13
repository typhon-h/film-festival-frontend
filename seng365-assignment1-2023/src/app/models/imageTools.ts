const getImageMimetype = (filename: string): string => {
    if (filename.endsWith('.jpeg') || filename.endsWith('.jpg')) return 'image/jpeg';
    if (filename.endsWith('.png')) return 'image/png';
    if (filename.endsWith('.gif')) return 'image/gif';
    return 'application/octet-stream';
}

const getImageExtension = (mimeType: string): string => {
    switch (mimeType) {
        case 'image/jpeg':
            return '.jpeg';
        case 'image/png':
            return '.png';
        case 'image/gif':
            return '.gif';
        default:
            return null;
    }
};

export {getImageMimetype, getImageExtension}