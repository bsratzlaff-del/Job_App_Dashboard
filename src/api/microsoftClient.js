//microsoft uses graph api to access outlook data. This file contains functions to access outlook data using microsoft graph api.
import axios from 'axios';

const outlookClient = axios.create({
    baseURL: 'https://graph.microsoft.com/v1.0',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default outlookClient;