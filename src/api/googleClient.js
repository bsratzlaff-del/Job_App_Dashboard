//setting up Axios for Google API calls
import axios from 'axios';

//reusable axios instance for Google's base API URL
const googleClient = axios.create({
    baseURL: 'https://www.googleapis.com',
    timeout: 10000,
})

//an interceptor to automatically add the access token before EACH request 
googleClient.interceptors.request.use(
    (config) => {
        //looks inside Device storage for saved token
        const token = localStorage.getItem('google_access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

//handles global errors (ie expired token, network issues, etc)
googleClient.interceptors.response.use(
    (response) => response, 
    (error) =>{
        if (error.response && error.response.status === 401) {
            console.error("Google Token expired or invalid. Re-routing to login page...");
            localStorage.removeItem('google_access_token');
            }
        return Promise.reject(error);
    }
);

export default googleClient;