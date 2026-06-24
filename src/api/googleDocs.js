//to duplicate the file for functionality of Google Docs API, we need to also import the Google Drive API command to duplicate the master file
import googleClient from './googleClient';


//clone the master Google Docs file, Resume Template
export const cloneDocsFile = async (fileId, newFileName) => {
    const response = await googleClient.post(`/drive/v3/files/${fileId}/copy`, {
        name: newFileName
    });
    return response.data;
}

//import Google Docs data
export const getDocsData = async (documentId) => {
    const response = await googleClient.get(`/docs/v1/documents/${documentId}`);
    return response.data;
}

//update Google Docs data
export const updateDocsData = async (documentId, requests) => {
    //use .batchUpdate() instead of .get()
    const response = await googleClient.post(`/docs/v1/documents/${documentId}:batchUpdate`, {
        requests
    });
    return response.data;
}

