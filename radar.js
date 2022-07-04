
const hexColors = [ "#ff7200"];
const steps = hexColors.length
const maxMessageLength = 250;


//var Filter = require('bad-words'),




const url = "https://www.reddit.com/r/all/comments.json?limit=100";

const comments = [];
let messageCount = 0;

function fetchComments(callback) {
  var Filter = require(['bad-words'], function (badwords) {
      console.log("checking");
  });
  filter = new Filter();
  console.log("fetching comments...");
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const shortComments = data.data.children.filter(
        (comment) => comment.data.body.length < maxMessageLength
      );
      comments.push(...shortComments);
      console.log(`${comments.length} comments in queue`);
      if (callback) {
        callback();
      }
    });
}

const commentTemplate = document.createElement("template");
commentTemplate.innerHTML = `<div class="comment"></div>`;

function radar() {
  const app = document.querySelector("#app");
  const loading = app.querySelector(".loading");
  loading.style.display = "none";

  function renderNewComment() {
    let comment = comments.pop();

    const clone = commentTemplate.content.cloneNode(true);
    const commentEl = clone.querySelector("div");

    commentEl.innerText = comment.data.body;
    commentEl.style["backgroundColor"] = hexColors[messageCount];
    app.prepend(commentEl);

    messageCount += 1;
    if (messageCount >= steps) {
      messageCount = 0;
    }

    if (comments.length < 10) {
      fetchComments();
    }
  }

  for (let i = 0; i < 20; i++) {
    renderNewComment();
  }

  setInterval(renderNewComment, 1000);
}

// kick it off
fetchComments(radar);