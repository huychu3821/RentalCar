import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from './firebaseConfig';

const fetchImageURL = async (imagePath) => {
    try {
        const imageRef = ref(storage, imagePath);
        const url = await getDownloadURL(imageRef);
        return url;
    } catch (error) {
        console.error('Error fetching image URL:', error);
        throw error;
    }
};

export default fetchImageURL;
