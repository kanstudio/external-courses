export default `
<template>
    <article class="book" data-id="{{id}}">
        <div class="book-image">
            <a href="{{path}}" class="book-image-link">
                <img src="{{image}}" alt="{{title}}" />
            </a>
        </div>
        <div class="book-fields">
            <h2 class="book-title">{{title}}</h2>
            <div class="book-author">by <span>{{author}}</span></div>
            <div class="book-rating" data-rating="{{totalRate}}">
                <div class="book-rating-stars" data-voted="no"></div>
            </div>
        </div>  
    </article>
</template>`;
