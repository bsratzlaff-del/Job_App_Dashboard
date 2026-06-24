import outlookClient from './microsoftClient.js';

//fetches top level inboxes (Inbox, Sent Items, Drafts, Deleted Items)
export const getTopLevelFolders = async () => {
    const response = await outlookClient.get('/me/mailFolders');
    return response.data.value;
};

//fetches emails from a specific folder
export const getInboxSubfolders = async () => {
    const response = await outlookClient.get('/me/mailFolders/Inbox/childFolders');
    return response.data.value;
};