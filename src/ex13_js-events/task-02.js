'use strict';

function filterBook(book) {
    let active = document.querySelector('.filter-search .filter .active');
    let filter = active.getAttribute('data-filter');
    if(filter === 'recent') {
        let bookTime = Date.parse(book.getAttribute('data-time'));
        let currentTime = 1542124939657; // new Date().getTime();
        if(currentTime - bookTime < 604800000) return true; // last week
        return false;
    }
    if(filter === 'popular') {
        let bookPopularity = book.getAttribute('data-sells');
        let popularLimit = 50;
        if(bookPopularity > popularLimit) return true; // popular
        return false;
    }
    if(filter === 'free') {
        let bookPrice = book.getAttribute('data-price');
        if(bookPrice === '0') return true; // free
        return false;
    }
    return true;
}

function filterBooks(ev) {
    let target = ev.target;
    if(target.classList.contains('active')) return false;
    let active = document.querySelector('.filter-search .filter .active');
    if(active) active.classList.remove('active');
    target.classList.add('active');
    let books = document.getElementsByClassName('book');
    for(let i=0; i<books.length; i++) {
        if(filterBook(books[i]) && searchBook(books[i])) books[i].style.display = 'block';
        else books[i].style.display = 'none';
    }
}

document.querySelector('.filter-search .filter').addEventListener('click', filterBooks);
