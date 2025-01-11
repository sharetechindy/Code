document.getElementById("toggleMenu").addEventListener("click", function() {
    let menuItems = document.querySelector(".menuItems");
    if(menuItems.style.display === "none" || !menuItems.style.display) {
        menuItems.style.display = "block";
    } else {
        menuItems.style.display = "none";
    }
});


document.getElementById('postButton').addEventListener('click', function() {
    var postContent = document.getElementById('postContent').value;
    if (postContent.trim() !== '') {
        var post = document.createElement('div');
        post.className = 'post';
        post.textContent = postContent;
        document.getElementById('newsFeed').appendChild(post);
        document.getElementById('postContent').value = '';
    }
});
