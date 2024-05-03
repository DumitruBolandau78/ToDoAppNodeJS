'use strict';

const dateNode = document.querySelectorAll('.goals .date');

dateNode.forEach(node => {
    let time = node.textContent;
    let timeFormat = new Date(time);
    node.innerHTML = 'Added on <i class="fa-solid fa-arrow-right"></i>' + timeFormat.toLocaleString();
});