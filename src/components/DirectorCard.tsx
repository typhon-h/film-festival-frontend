import axios from "axios";
import React from "react";
import { Buffer } from "buffer";
import default_profile_picture from "../assets/default_profile_picture.png";


const DirectorCard = (props: any) => {
    const [directorImage, setDirectorImage] = React.useState<string>("");
    const [directorImageLoaded, setDirectorImageLoaded] = React.useState<boolean>(false);

    React.useEffect(() => {
        const getDirectorImage = () => {
            axios.get((process.env.REACT_APP_DOMAIN as string) + '/users/' + props.director.id + '/image', { responseType: "arraybuffer" })
                .then((response) => {
                    setDirectorImage(`data: ${response.headers['content-type']}; base64, ${Buffer.from(response.data, 'binary').toString('base64')}`);
                    setDirectorImageLoaded(true)
                }, (error) => {
                    setDirectorImage(default_profile_picture);
                    setDirectorImageLoaded(true);
                })
        }

        getDirectorImage()
    }, [props.director.id])



    return (
        <div className={'d-flex flex-row align-items-center justify-content-between py-2 px-3 ' + (directorImageLoaded ? '' : 'placeholder-glow')}>
            <div className={'ratio ratio-1x1 rounded-circle border overflow-hidden ' + (directorImageLoaded ? '' : 'placeholder')} style={{ minWidth: '20%', maxWidth: '20%' }}>
                <img className={'mx-auto ' + (directorImageLoaded ? '' : 'd-none')} src={directorImage} alt="Director Icon" style={{ objectFit: 'cover' }} />
            </div>
            <p className="mb-0">{props.director.firstName}</p>
            <p className="mb-0">{props.director.lastName}</p>
        </div>
    )
}

export default DirectorCard