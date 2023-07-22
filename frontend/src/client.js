
import sanityClient from "@sanity/client";
import ImageUrlBuilder from '@sanity/image-url';
import Axios from 'axios';


export const client = sanityClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2022-02-01',
    token: process.env.REACT_APP_SANITY_TOKEN,
    useCdn: true,
    
});

export const mensDatabase = () => {
    
    return client.fetch('*[_type == "Mens__Shoes"]');
}


const builder = ImageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

export const checkEmailValidity = (email) => {

    return Axios.get(`http://localhost:3001/checkEmail/${email}`);
}





