'use strict';

function Hangman(word) {
    this.word = word;
    this.state = new Array(word.length).fill('_');
    this.wrongSymbols = [];
    this.totalSymbols = [];
    this.errorsLeft = 6;
    this.output = '';

    this.guess = function(letter) {
        if(this.state.join('') === this.word || this.errorsLeft <= 0) {
            console.log('Game over');
            this.output += 'Game over\n';
            return this;
        }
        if(!~letter.search(/\w/)) {
            console.log('Wrong input');
            this.output += 'Wrong input\n';
            return this;
        }
        let phrase = new RegExp(letter, 'i');
        if(~this.totalSymbols.join('').search(phrase)) {
            console.log('This letter already was');
            this.output += 'This letter already was\n';
            return this;
        }
        this.totalSymbols.push(letter.toLowerCase());
        if(~this.word.search(phrase)) {
            this.state = this.state.map((l, i) => ~this.word[i].search(phrase) ? this.word[i] : l);
            if(this.state.join('') === this.word) {
                console.log(this.state.join('') + ' | You won!');
                this.output += this.state.join('') + ' | You won!\n';
            }
            else {
                console.log(this.state.join(''));
                this.output += this.state.join('') + '\n';
            }
        }
        else {
            if(--this.errorsLeft) {
                this.wrongSymbols.push(letter.toLowerCase());
                console.log('Wrong letter, errors left ' + this.errorsLeft + ' | ' + this.wrongSymbols.join());
                this.output += 'Wrong letter, errors left ' + this.errorsLeft + ' | ' + this.wrongSymbols.join() + '\n';
            }
            else {
                console.log('Wrong letter, errors left 0 | Game over | The word was: ' + this.word);
                this.output += 'Wrong letter, errors left 0 | Game over | The word was: ' + this.word + '\n';
            }
        }
        return this;
    };

    this.getStatus = function() {
        console.log(this.totalSymbols);
        this.output += this.totalSymbols + '\n';
        return this;
    };

    this.startAgain = function(newWord) {
        this.word = newWord;
        this.state = new Array(newWord.length).fill('_');
        this.wrongSymbols = [];
        this.totalSymbols = [];
        this.errorsLeft = 6;
        this.output = '';
        return this;
    };

    this.getGuessedString = function() {
        console.log(this.state.join(''));
        this.output += this.state.join('') + '\n';
        return this;
    };

    this.getErrorsLeft = function() {
        console.log(this.errorsLeft);
        this.output += this.errorsLeft + '\n';
        return this;
    };

    this.getWrongSymbols = function() {
        console.log(this.wrongSymbols);
        this.output += this.wrongSymbols + '\n';
        return this;
    };

    this.toString = function() {
        let outputData = this.output.trim();
        this.output = '';
        return outputData;
    };
}

module.exports = new Hangman('webpurple');
