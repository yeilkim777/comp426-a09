

export async function getBroadOrNarrow(url) {
    // returns list of tweets or specific tweet depending on url
    const result = await axios({
        method: 'get',
        url: url,
        withCredentials: true,
    });
    return result.data
}

export async function createTwit(twitBody, type) {
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: twitBody,
            type: type
        },
    });
    //return result;
}

export async function updateTwit(string, url) {
    const result = await axios({
        method: 'put',
        url: url,
        withCredentials: true,
        data: {
            body: string
        },
    });
}
export async function likeOrUnlike(url) {
    const result = await axios({
        method: 'put',
        url: url,
        withCredentials: true,
    });
}

export async function deleteTwit(url) {
    const result = await axios({
        method: 'delete',
        url: url,
        withCredentials: true,
    });
}

export async function replyOrReTwit(typeText, parentID, replyBody) {
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            'type': typeText,
            'parent': parentID,
            'body': replyBody
        }
    });
}

export async function testGetReplies() {
    // returns list of tweets or specific tweet depending on url
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        param: {
            'type': 'reply',
            'parentId': 3570
        }
    });
    return result.data

}


