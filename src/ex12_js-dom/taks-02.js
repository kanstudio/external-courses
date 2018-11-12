'use strict';

function deleteTextNodes(parent) {
    if(parent.hasChildNodes()) {
        parent.childNodes.forEach(child => {
            if(child.nodeType === 3) parent.removeChild(child);
        });
    }
}
