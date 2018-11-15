'use strict';

function openPopup() {
    let popup = document.querySelector('.popup');
    popup.style.display = 'flex';
    setTimeout(() => {
        popup.setAttribute('data-view', 'show');
    }, 1);
}

function closePopup() {
    let popup = document.querySelector('.popup');
    popup.setAttribute('data-view', 'hide');
    setTimeout(() => {
        popup.style.display = 'none';
    }, 300);
}

function prepend(container, newElement) {
    container.insertBefore(newElement, container.firstChild);
    return newElement;
}

function addBook(ev) {
    let form = document.querySelector('.addbook-form');
    let title = form.querySelector('[name="title"]').value;
    let author = form.querySelector('[name="author"]').value;
    let image = form.querySelector('[name="image"]').value;
    if(!image) image = 'assets/img/newbook.jpg';
    let price = form.querySelector('[name="price"]').value;
    if(title && author && price) ev.preventDefault();
    let book = document.createElement('article');
    book.classList.add('book');
    book.setAttribute('data-time', new Date().toISOString());
    book.setAttribute('data-sells', '0');
    book.setAttribute('data-price', price);
    let bookContent = '<img class="book-image" src="' + image + '" alt="' + title +
        '"><h2 class="book-title">' + title +
        '</h2><p class="book-author">by <span>' + author + '</span></p>' +
        '<div class="book-rating" data-rating="0">' +
        '<i class="fa fa-star-o" aria-hidden="true"></i>' +
        '<i class="fa fa-star-o" aria-hidden="true"></i>' +
        '<i class="fa fa-star-o" aria-hidden="true"></i>' +
        '<i class="fa fa-star-o" aria-hidden="true"></i>' +
        '<i class="fa fa-star-o" aria-hidden="true"></i>' +
        '</div>';
    book.innerHTML = bookContent;
    prepend(document.querySelector('.books'), book);
    let message = document.querySelector('.popup-message');
    message.style.display = 'block';
    message.style.opacity = '0';
    setTimeout(() => {
        message.style.opacity = '1';
    }, 10);
    setTimeout(() => {
        message.innerHTML = '<div style="opacity: 0">The book was added!</div>';
        message.getElementsByTagName('div')[0].style.opacity = '1';
    }, 300);
    setTimeout(() => {
        closePopup();
        message.innerHTML = '';
        message.style.display = 'none';
        message.style.opacity = '0';
    }, 2000);
}

document.querySelector('.button-addbook').addEventListener('click', openPopup);

document.querySelector('.popup-close').addEventListener('click', closePopup);

document.querySelector('.addbook-form').addEventListener('submit', addBook);
