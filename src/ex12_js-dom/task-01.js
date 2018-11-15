'use strict';

function prepend(container, newElement) {
    container.insertBefore(newElement, container.firstChild);
    return newElement;
}

function randomExt(min=0, max=1, precision=16) {
    return +(Math.random()*(max-min)+min).toFixed(precision);
}

function addRandomElement(container, tag) {
    let element = document.createElement(tag);
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;
    element.style.position = 'fixed';
    element.style.cursor = 'pointer';
    element.style.width = randomExt(10, windowWidth/5, 0) + 'px';
    element.style.height = randomExt(10, windowHeight/5, 0) + 'px';
    element.style.left = randomExt(0, windowWidth-10, 0) + 'px';
    element.style.top = randomExt(0, windowHeight-10, 0) + 'px';
    element.style.backgroundColor = 'rgb(' + randomExt(0, 255, 0) + ', ' + 
                                             randomExt(0, 255, 0) + ', ' + 
                                             randomExt(0, 255, 0) + ')';
    prepend(container, element);
	return element;
}

function onAddClick() {
    let element = addRandomElement(document.body, 'div');
    element.onmousedown = ev => {
        let shiftX = ev.pageX - element.getBoundingClientRect().left;
        let shiftY = ev.pageY - element.getBoundingClientRect().top;
        
        element.ondragstart = () => false;

        document.onmousemove = ev => {
            element.style.left = ev.pageX - shiftX + 'px';
            element.style.top = ev.pageY - shiftY + 'px';
        }

        element.onmouseup = () => {
            document.onmousemove = null;
            element.onmouseup = null;
        }
    };
}

function onResetClick() {
    document.querySelectorAll('div').forEach(node => {
        node.parentNode.removeChild(node);
    });
}

document.getElementById('add').addEventListener('click', onAddClick);
document.getElementById('reset').addEventListener('click', onResetClick);
