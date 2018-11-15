'use strict';

function scanDOM() {
    let statistics = {
        collections: {
            tags: {
                message: 'Тэгов',
                total: 0,
                elements: {}
            },
            text: {
                message: 'Текстовых узлов',
                total: 0
            },
            classes: {
                message: 'Элементов с классом',
                total: 0,
                elements: {}
            }
        },
        report: ''
    };

    function scanNode(node) {
        let tags = statistics.collections.tags.elements;
        let classes = statistics.collections.classes.elements;
        node.childNodes.forEach(child => {
            if(child.nodeType === 1) {
                /*--- tag ---*/
                if(child.localName in tags) {
                    tags[child.localName]++;
                    /*--- classes of tag ---*/
                    if(child.classList.length) {
                        child.classList.forEach(childClass => {
                            if(childClass in classes) classes[childClass]++;
                            else classes[childClass] = 1;
                            statistics.collections.classes.total++;
                        });
                    }
                }
                else tags[child.localName] = 1;
                statistics.collections.tags.total++;
                /*--- scan this child ---*/
                if(child.hasChildNodes()) scanNode(child);
            }
            else if(child.nodeType === 3) statistics.collections.text.total++;
        });
    }

    scanNode(document);

    /*--- make report ---*/
    for(let collectionName in statistics.collections) {
        let collection = statistics.collections[collectionName];
        if(collection.total > 0 && 'elements' in collection) {
            for(let element in collection.elements) {
                statistics.report += collection.message + ' ' + element + ': ' + collection.elements[element] + '\n';
            }
        }
        else {
            statistics.report += collection.message + ': ' + collection.total + '\n';
        }
        statistics.report += '\n';
    }

    console.log(statistics.report);

    return statistics;
}
