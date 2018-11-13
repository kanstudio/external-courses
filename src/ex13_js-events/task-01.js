'use strict';

Object.prototype.accordion = function(speed=300) {
    if(this.constructor !== HTMLCollection && this.nodeType !== 1) return false;
    function setAccordion(menu) {
        let items = menu.children;
        for(let i=0; i<items.length; i++) {
            let submenu = items[i].getElementsByTagName('ul')[0];
            submenu.style.transition = 'max-height ease ' + speed + 'ms';
            if(items[i].classList.contains('menu-active')) {
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
            else {
                submenu.style.maxHeight = '0px';
            }
        }
        menu.addEventListener('click', ev => {
            let target = ev.target.closest('.accordion-menu > li');
            if(target && !target.classList.contains('menu-active')) {
                let active = menu.getElementsByClassName('menu-active')[0];
                if(active) {
                    active.classList.remove('menu-active');
                    active.getElementsByTagName('ul')[0].style.maxHeight = '0px';
                }
                target.classList.add('menu-active');
                let submenu = target.getElementsByTagName('ul')[0];
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
        });
    }
    if(this.constructor === HTMLCollection) {
        for(let i=0; i<this.length; i++) {
            setAccordion(this[i]);
        }
    }
    else setAccordion(this);   
    return true; 
};

document.getElementsByClassName('accordion-menu').accordion(400);
