import googleClient from './googleClient';

//import Google Sheets data
export const getSheetsData = async (spreadsheetId) => {
    const response = await googleClient.get(`/sheets/v4/spreadsheets/${spreadsheetId}`);
    return response.data;
}

//update Google Sheets data
export const updateSheetsData = async (spreadsheetId, range, newRows) => {
    //use .put() instead of .get()
    //then add '/values/${range}' to the end of new URL to target the specific range of cells to update
    const response = await googleClient.put(`/sheets/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
        values: newRows
    }, {
        params: {
            valueInputOption: 'USER_ENTERED'
        }
    });
    return response.data;
}