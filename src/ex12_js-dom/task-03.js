'use strict';

function deleteTextNodesAll(parent) {
    let childNodes = parent.childNodes;
    if(parent.hasChildNodes()) {
        childNodes.forEach(function(child) {
            if(child.nodeType === 3) parent.removeChild(child);
        });
        childNodes.forEach(function(child) {
            if(child.nodeType === 1 && child.hasChildNodes()) deleteTextNodesAll(child);
        });
    }
}
