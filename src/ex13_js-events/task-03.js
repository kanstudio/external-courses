'use strict';

function searchBook(book) {
    let phrase = document.querySelector('.search-field [name="search"]').value;
    let title = book.getElementsByClassName('book-title')[0];
    let author = book.getElementsByClassName('book-author')[0];
    title.innerHTML = title.textContent.replace(/<b[^>]>/g, '').replace(/<\/b>/g, '');
    author.innerHTML = author.textContent.replace(/<b[^>]>/g, '').replace(/<\/b>/g, '');
    if(!phrase) return true;

    let search = new RegExp(phrase, 'ig');
    let inTitle = title.textContent.search(search);
    let inAuthor = author.textContent.search(search);
    if(~inTitle) {
        title.innerHTML = title.textContent.replace(search, '<b style="font-weight: inherit; background-color: #a8deff;">$&</b>');
    }
    if(~inAuthor) {
        author.innerHTML = author.textContent.replace(search, '<b style="font-weight: inherit; background-color: #a8deff;">$&</b>');
    }
    if(~inTitle || ~inAuthor) return true;
    return false;
}

function searchBooks() {
    let books = document.getElementsByClassName('book');
    for(let i=0; i<books.length; i++) {
        if(searchBook(books[i]) && filterBook(books[i])) books[i].style.display = 'block';
        else books[i].style.display = 'none';
    }
}

document.querySelector('.search-field [name="search"]').addEventListener('keyup', searchBooks);
