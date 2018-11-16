'use strict';

function Hangman(word) {
    this.word = word;
    this.state = new Array(word.length).fill('_');
    this.wrongSymbols = [];
    this.totalSymbols = [];
    this.errorsLeft = 6;

    this.guess = function(letter) {
        if(this.state.join('') === this.word || this.errorsLeft <= 0) {
            console.log('Game over');
            return this;
        }
        if(!~letter.search(/\w/)) {
            console.log('Wrong input');
            return this;
        }
        let phrase = new RegExp(letter, 'i');
        if(~this.totalSymbols.join('').search(phrase)) {
            console.log('This letter already was');
            return this;
        }
        this.totalSymbols.push(letter.toLowerCase());
        if(~this.word.search(phrase)) {
            this.state = this.state.map((l, i) => ~this.word[i].search(phrase) ? this.word[i] : l);
            if(this.state.join('') === this.word) {
                console.log(this.state.join('') + ' | You won!');
            }
            else {
                console.log(this.state.join(''));
            }            
        }
        else {
            if(--this.errorsLeft) {
                this.wrongSymbols.push(letter.toLowerCase());
                console.log('Wrong letter, errors left ' + this.errorsLeft + ' | ' + this.wrongSymbols.join());
            }
            else {
                console.log('Wrong letter, errors left 0 | Game over | The word was: ' + this.word);
            }
        }
        return this;
    };

    this.getStatus = function() {
        console.log(this.totalSymbols);
        return this;
    };

    this.startAgain = function(newWord) {
        this.word = newWord;
        this.state = new Array(newWord.length).fill('_');
        this.wrongSymbols = [];
        this.totalSymbols = [];
        this.errorsLeft = 6;
        return this;
    };

    this.getGuessedString = function() {
        console.log(this.state.join(''));
        return this;
    };

    this.toString = function() {
        return this.state.join('');
    };

    this.valueOf = function() {
        return this.state.join('');
    };

    this.getErrorsLeft = function() {
        console.log(this.errorsLeft);
        return this;
    };

    this.getWrongSymbols = function() {
        console.log(this.wrongSymbols);
        return this;
    };
}

module.exports = new Hangman('webpurple');
