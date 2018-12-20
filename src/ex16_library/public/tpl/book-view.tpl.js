export default `
<template>
    <div class="book-view">
        <article class="book" data-id="{{id}}" data-created="{{created_at}}">
            <div class="book-data">
                <div class="book-image">
                    <img src="{{image}}" alt="{{title}}" />
                </div>
                <div class="book-fields">
                    <div class="book-price">Price: <span>\${{price}}</span></div>
                    <div class="book-rating" data-rating="{{totalRate}}">
                        <div class="book-rating-stars" data-voted="no"></div>
                        <div class="book-total-rate">Total rate: <span>{{totalRate}}</span></div>
                    </div>
                    <div class="book-rates">
                        <div class="book-rates-count">
                            <div class="book-votes-count">Votes: <span>{{votes}}</span></div>
                            <div class="book-rates-count-stars" data-stars="5">
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <span>{{starsFive}}</span>
                            </div>
                            <div class="book-rates-count-stars" data-stars="4">
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <span>{{starsFour}}</span>
                            </div>
                            <div class="book-rates-count-stars" data-stars="3">
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <span>{{starsThree}}</span>
                            </div>
                            <div class="book-rates-count-stars" data-stars="2">
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <span>{{starsTwo}}</span>
                            </div>
                            <div class="book-rates-count-stars" data-stars="1">
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                                <span>{{starsOne}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="book-info">
                <hgroup>
                    <h1>{{title}}</h1>
                    <h2>{{author}}</h2>
                    <div class="book-published">Published at: {{published_at}}</div>
                </hgroup>
                <div class="book-description">
                    <div class="book-header">Description</div>
                    <p>{{description}}</p>
                </div>
                <div class="book-keywords">
                    <div class="book-header">Keywords</div>
                    <span>{{keywords}}</span>
                </div>
            </div>
        </article>
    </div>
</template>`;
