import googleClient from './googleClient';

//fetch recent inbox emails from Gmail
export const getRecentInboxEmails = async () => {
    const oneWeekAgo = new Date();
    //how to solve this?
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const dateString = oneWeekAgo.toISOString().split('T')[0].replace(/-/g, '/');

    const response = await googleClient.get(`/gmail/v1/users/me/messages`, {
        params: {
            q: `label:INBOX after:${dateString}`
        }
    });
    return response.data;
};



//fetch a specific email from Gmail (Subject, From, Body, etc.)
export const getEmail = async (emailId) => {
    const response = await googleClient.get(`/gmail/v1/users/me/messages/${emailId}`, {
        params: {
            format: 'full'
        }
    });
    return response.data;
};


//send an email using Gmail API
export const sendEmial = async (to, subject, messageText) => {
    const emailPart = [
        'To: ${to}',
        'Subject: ${subject}',
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        messageText
    ];
    const emailString = emailParts.join('\n');

    //converts to web safe Base64 encoding for Gmail API (required)
    const encodedMessage = btoa(unescape(encodeURIComponent(emailString)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const repsonse = await googleClient.psot('/gmail/v1/users/me/messges/send', {
        raw: encodedMessage
    });
    return response.data;
}