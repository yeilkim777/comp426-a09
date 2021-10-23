import "./twitTwit.js"
import {
    createTwit, getBroadOrNarrow,
    updateTwit, likeOrUnlike, replyOrReTwit, deleteTwit, testGetReplies
} from "./twitTwit.js";

$(function () {
    loadTwitTwit();
})

export async function loadTwitTwit() {
    const $root = $('#root');
    $root.append(`
    <div id = 'profileDiv'>
        <h1>Twit Tree x Make it Grow</h1>
        <textarea id = 'twitBody' maxlength="280"></textarea>
        <button class = 'btncreate' id = 'createTwiti'>              
            <div class="btn_container">
                <img  src="https://w7.pngwing.com/pngs/710/874/png-transparent-green-leaf-illustration-leaf-logo-banana-leaves-leaf-vegetable-text-maple-leaf-thumbnail.png" width="30" height="30"/>
                <span class="btn-txt">Create Twit</span>
            </div>
        </button>
        <button class = 'btn refresh'>              
        <div class="btn_container">
            <img  src="https://w7.pngwing.com/pngs/710/874/png-transparent-green-leaf-illustration-leaf-logo-banana-leaves-leaf-vegetable-text-maple-leaf-thumbnail.png" width="30" height="30"/>
            <span class="btn-txt">Refresh</span>
        </div>
    </button>
    </div>
    <div id = 'divFeed'></div>
    `)

    //create the feed
    createFeed();
    
    //Used to create twit
    $root.on("click", '#createTwiti', handleTwitCreation)
    $root.on('click', '.refresh', handleRefresh)


    //Buttons for other users' twit    
    $root.on("click", '.reply', handleReplyTab)
    $root.on("click", '.cancel', handleCancel)
    $root.on("click", '.comment', handleReplyApi)
    $root.on('click', '.retweet', handleRetweet)
    $root.on('click', '.like', handleLike)

    //Used for collapsible reply tab
    $root.on('click','.collapsible', handleCollapse)

    //Buttons for original user's twit
    $root.on('click', '.edit', handleEdit)
    $root.on('click', '.editAPI', handleEditApi)
    $root.on('click', '.delete', handleDelete)
}
export async function handleTwitCreation (event) {
    let twit = document.getElementById('twitBody').value;
    await createTwit(twit, 'tweet')

    document.getElementById('twitBody').value = "";
    
    
    $('#divFeed').html(
        createFeed()
    )
    //document.location.reload(true)
}

export const handleRefresh = function() {
    $('#divFeed').html(
        createFeed()  
    )
}


export async function createFeed() {
    let feed = await getBroadOrNarrow('https://comp426-1fa20.cs.unc.edu/a09/tweets')
    for (let i = 0; i < 50; i++) {
        let pic
        if (feed[i]['isLiked']) {
            pic = 'https://creazilla-store.fra1.digitaloceanspaces.com/emojis/48845/green-heart-emoji-clipart-sm.png'
        } else {
            pic = 'https://i.pinimg.com/originals/82/c2/61/82c261d3a9c2d8a0bae29f0fe0c04d3a.jpg'
        }
        let createdConvert = new Date(feed[i]['createdAt']);
        let createdTime = createdConvert.toLocaleDateString().split(/:| /)
        let correctMinute = createdConvert.getMinutes();
        
        if (correctMinute < 10) { 
            correctMinute = '0' + correctMinute;
        }

        if (feed[i]['isMine']) {
            $('#divFeed').append(`
            <div class = 'feedBody userPosted' id = ${feed[i]['id']}>
                <div class = 'sideBySide'>
                    <h2 class = 'userN'>${feed[i]['author']}</h2>
                    <h3>${'created: ' + createdTime + ' ' + createdConvert.getHours() + ':' + correctMinute}</h3>
                </div>
                <p>${feed[i]['body']}</p> 
                <button class="btn edit">               
                    <div class="btn_container">
                        <img  src="https://toppng.com/uploads/preview/edit-11550726311rznx1wawzg.png" width="30" height="30"/>
                        <span class="btn-txt">Edit</span>
                    </div>
                </button>
                <button class='btn delete'>               
                    <div class="btn_container">
                        <img  src="https://cdn2.iconfinder.com/data/icons/natural-green-perfect-pixel/512/delete_dustbin-512.png" width="30" height="30"/>
                        <span class="btn-txt">Delete</span>
                    </div>
                </button> 
                <button class="btn reply">               
                <div class="btn_container">
                    <img  src= 'https://cdn.iconscout.com/icon/free/png-256/reply-all-457915.png' width="30" height="30"/>
                    <span class="btn-txt">${feed[i]['replyCount']}</span>
                </div>
                </button>
                <button class="btn retweet">               
                <div class="btn_container">
                    <img  src="data:image/png;base64,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" width="30" height="30"/>
                    <span class="btn-txt">${feed[i]['retweetCount']}</span>
                </div>
                </button>
                <button class="btn">               
                <div class="btn_container">
                    <img  src="https://creazilla-store.fra1.digitaloceanspaces.com/emojis/48845/green-heart-emoji-clipart-sm.png" width="30" height="30"/>
                    <span class="btn-txt">${feed[i]['likeCount']}</span>
                </div>
                </button>

                </div>

        `)
        } else {
            $('#divFeed').append(`
                <div class = 'feedBody' id = ${feed[i]['id']}>
                    <div class = 'sideBySide'>
                        <h2 class = 'userN'>${feed[i]['author']}</h2>
                        <h3>${'created: ' + createdTime + ' ' + createdConvert.getHours() + ':' + correctMinute}</h3>
                    </div>
                    <p class = 'retweetClass'>${feed[i]['body']}</p>
            
                    <button class="btn reply">               
                        <div class="btn_container">
                            <img  src='https://cdn.iconscout.com/icon/free/png-256/reply-all-457915.png' width="30" height="30"/>
                            <span class="btn-txt">${feed[i]['replyCount']}</span>
                        </div>
                    </button>
                    <button class="btn retweet">               
                        <div class="btn_container">
                            <img  src="data:image/png;base64,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" width="30" height="30"/>
                            <span class="btn-txt">${feed[i]['retweetCount']}</span>
                        </div>
                    </button>
                    <button class="btn like">               
                        <div class="btn_container">
                            <img  src=${pic} width="30" height="30"/>
                            <span class="btn-txt">${feed[i]['likeCount']}</span>
                        </div>
                    </button>

                </div>
        `)

        }
    }

    // <button type="button" class="collapsible">Open Collapsible</button>
    // <div class="content">
    //   <div class = 'feedBody replyBody comments'>
    //       <div class = 'sideBySide'>
    //           <h2 class = 'userN'>commentor name</h2>
    //           <h3>date created</h3>
    //       </div>
    //       <p>testing, testing</p> 
    //   </div>
    //   <div class = 'feedBody replyBody comments'>
    //   <div class = 'sideBySide'>
    //       <h2 class = 'userN'>commentor name</h2>
    //       <h3>date created</h3>
    //   </div>
    //   <p>testing, testing</p> 
    //   </div>
    // </div>


}

export const handleCollapse = function(event) {
    //console.log(($(event.target.closest('.feedBody'))).find('.content'));
    //($(event.target.closest('.content'))).attr('style', '500px');
    ($(event.target.closest('.feedBody'))).find('.content').show()
}

export const handleReplyTab = function (event) {
    //save parent id from original
    let parentID = ($(event.target.closest('.feedBody'))).attr('id');
    ($(event.target.closest('.feedBody'))).after(`
    <div class = 'feedBody replyBody' id = ${parentID}>
        <div class = 'sideBySide'>
            <h2 class = 'userN'>Reply</h2>
        </div>
        <textarea id = 'replyText' maxlength="280"></textarea> 
        <button class="btn comment">               
            <div class="btn_container">
                <img  src="https://static.thenounproject.com/png/582750-200.png" width="30" height="30"/>
                <span class="btn-txt">Reply</span> 
            </div>
        </button>
        <button class='btn cancel'>               
            <div class="btn_container">
                <img  src="https://cdn2.iconfinder.com/data/icons/natural-green-perfect-pixel/512/delete_dustbin-512.png" width="30" height="30"/>
                <span class="btn-txt">Cancel</span>
            </div>
        </button>
    </div>
    `);
}

export async function handleReplyApi (event) {
    //get parent id using the 
    let parentID = ($(event.target.closest('.replyBody'))).attr('id');
    let twit = document.getElementById('replyText').value;

    await replyOrReTwit('reply', parentID, twit)
    let idURL = 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + parentID;
    let body = await getBroadOrNarrow(idURL);
    handleCancel(event);
    //($(event.target.closest('.feedBody #'+parentID))).find('.btn.reply').find('span').text(body['retweetCount']);
    $('#' + parentID).find('.btn.reply').find('span').text(body['replyCount']);

    

    //document.location.reload(true)
}

export const handleCancel = function (event) {
    ($(event.target.closest('.replyBody'))).remove();
}

export async function handleRetweet(event) {
    let parentID = ($(event.target.closest('.feedBody'))).attr('id')
    let idURL = 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + parentID;
    let body = await getBroadOrNarrow(idURL);
    await replyOrReTwit('retweet', parentID, 'Retweet of ' + body['author'] + ' '+ body['body'] )
    body = await getBroadOrNarrow(idURL);
    
    // Depending on it should be viewed, used the button reload or replace the feed
    
    //($(event.target.closest('.feedBody'))).find('.btn.retweet').find('span').text(body['retweetCount']);

    $('#divFeed').html(
        createFeed()  
    )

}

export async function handleLike(event) {
    let parentID = ($(event.target.closest('.feedBody'))).attr('id');
    let idURL = 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + parentID;
    let idURLLike = idURL + '/like'
    let idURLUnlike = idURL + '/unlike'
    
    if (($(event.target.closest('.feedBody'))).find('.btn.like').find('img').attr('src') == 'https://creazilla-store.fra1.digitaloceanspaces.com/emojis/48845/green-heart-emoji-clipart-sm.png') {
        await likeOrUnlike(idURLUnlike);
        ($(event.target.closest('.feedBody'))).find('.btn.like').find('img').attr('src','https://i.pinimg.com/originals/82/c2/61/82c261d3a9c2d8a0bae29f0fe0c04d3a.jpg');
    } else {
        await likeOrUnlike(idURLLike);
        ($(event.target.closest('.feedBody'))).find('.btn.like').find('img').attr('src','https://creazilla-store.fra1.digitaloceanspaces.com/emojis/48845/green-heart-emoji-clipart-sm.png');
    }

    let body = await getBroadOrNarrow(idURL);
    ($(event.target.closest('.feedBody'))).find('.btn.like').find('span').text(body['likeCount']);
}

export async function handleDelete (event) {
    let idToDelete = ($(event.target.closest('.feedBody'))).attr('id')
    let idURL = 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + idToDelete;
    await deleteTwit(idURL)

    $('#divFeed').html(
        createFeed()
    )
    //document.location.reload(true); 

}

export async function handleEdit(event) {
    let parentID = ($(event.target.closest('.feedBody'))).attr('id');
    let idURL = 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + parentID;
    let body = await getBroadOrNarrow(idURL);
    ($(event.target.closest('.feedBody'))).after(`
    <div class = 'feedBody replyBody edity' id = ${parentID}>
        <div class = 'sideBySide'>
            <h2 class = 'userN'>Edit</h2>
        </div>
        <textarea id = 'replyText' maxlength="280">${body['body']}</textarea> 
        <button class="btn editAPI">               
            <div class="btn_container">
                <img  src="https://static.thenounproject.com/png/582750-200.png" width="30" height="30"/>
                <span class="btn-txt">Edit</span> 
            </div>
        </button>
        <button class='btn cancel'>               
            <div class="btn_container">
                <img  src="https://cdn2.iconfinder.com/data/icons/natural-green-perfect-pixel/512/delete_dustbin-512.png" width="30" height="30"/>
                <span class="btn-txt">Cancel</span>
            </div>
        </button>
    </div>
    `);
}

export async function handleEditApi(event) {
    let parentID = ($(event.target.closest('.replyBody'))).attr('id');
    let twit = document.getElementById('replyText').value;
    let idURL = 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + parentID;
    await updateTwit(twit, idURL)
    handleCancel(event);
    //document.location.reload(true)

    let body = await getBroadOrNarrow(idURL);
    //($(event.target.closest('.feedBody #'+parentID))).find('.btn.reply').find('span').text(body['retweetCount']);
    $('#' + parentID).find('p').text(body['body']);

}



    // Twits from others
    // $root.append(`
    // <div class = 'feedBody' >
    //     <div class = 'sideBySide'>
    //         <h2 class = 'userN'>j;alsdfjkas;dlfjka;sldfj;j</h2>
    //         <h3>date created</h3>
    //     </div>
    //     <p>testing, testing</p>

    //     <button class="btn reply">               
    //         <div class="btn_container">
    //             <img  src="./icons/comment.png" width="30" height="30"/>
    //             <span class="btn-txt">12</span>
    //         </div>
    //     </button>
    //     <button class="btn retweet">               
    //         <div class="btn_container">
    //             <img  src="./icons/retweet.png" width="30" height="30"/>
    //             <span class="btn-txt">130</span>
    //         </div>
    //     </button>
    //     <button class="btn like">               
    //         <div class="btn_container">
    //             <img  src="./icons/like.png" width="30" height="30"/>
    //             <span class="btn-txt">5</span>
    //         </div>
    //     </button>
    //     <button class="btn unlike">               
    //         <div class="btn_container">
    //             <img  src="http://placehold.it/30x30" width="30" height="30"/>
    //             <span class="btn-txt">5</span>
    //         </div>
    //     </button>
    // </div>
    // `)

    // twits from original
    // $root.append(`
    // <div class = 'feedBody userPosted'>
    //     <div class = 'sideBySide'>
    //         <h2 class = 'userN'>j;alsdfjkas;dlfjka;sldfj;j</h2>
    //         <h3>date created</h3>
    //     </div>
    //     <p>testing, testing</p> 
    //     <button class="btn edit">               
    //         <div class="btn_container">
    //             <img  src="./icons/comment.png" width="30" height="30"/>
    //             <span class="btn-txt">Edit</span>
    //         </div>
    //     </button>
    //     <button class='btn delete'>               
    //         <div class="btn_container">
    //             <img  src="./icons/retweet.png" width="30" height="30"/>
    //             <span class="btn-txt">Delete</span>
    //         </div>
    //     </button> 
    //     <button class="btn reply">               
    //     <div class="btn_container">
    //         <img  src="./icons/comment.png" width="30" height="30"/>
    //         <span class="btn-txt"></span>
    //     </div>
    // </button>
    // <button class="btn retweet">               
    //     <div class="btn_container">
    //         <img  src="./icons/retweet.png" width="30" height="30"/>
    //         <span class="btn-txt"></span>
    //     </div>
    // </button>
    // <button class="btn like">               
    //     <div class="btn_container">
    //         <img  src="./icons/like.png" width="30" height="30"/>
    //         <span class="btn-txt"></span>
    //     </div>
    // </button>
    // <button class="btn unlike">               
    //     <div class="btn_container">
    //         <img  src="http://placehold.it/30x30" width="30" height="30"/>
    //         <span class="btn-txt">5</span>
    //     </div>
    // </button>

    // </div>
    // `)

    // for twit comments
    // $root.append(`
    //  <div class = 'feedBody replyBody comments'>
    //      <div class = 'sideBySide'>
    //          <h2 class = 'userN'>commentor name</h2>
    //          <h3>date created</h3>

    //      </div>
    //      <p>testing, testing</p> 
    //  /div>
    // `)
    // possibly change functionality of original button to unlike when clicked again


