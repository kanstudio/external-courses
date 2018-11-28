/* jshint esversion: 6 */

(function () {
    'use strict';

    class Confection {
        constructor(weight) {
            this.weight = weight;
        }
    }

    class Candy extends Confection {
        constructor(name, weight) {
            super(weight);
            this.name = name;
        }
    }

    let candy1 = new Candy('Candy 1', 300);
    let candy2 = new Candy('Candy 2', 200);
    let candy3 = new Candy('Candy 3', 100);

    class Gift {
        constructor(name) {
            this.name = name;
            this.weight = 0;
            this.items = [];
        }

        addItem(item) {
            this.items.push(item);
            this.weight += item.weight;
            return this;
        }

        sortBy(param) {
            this.items.sort((a, b) => {
                if (param === 'name') return a.name >= b.name ? 1 : -1;
                if (param === 'weight') return a.weight - b.weight;
            });
        }

        findName(itemName) {
            let giftContent = this.items.filter(item => item.name === itemName);
            if (giftContent.length) {
                let giftInfo = 'Items ' + itemName + ' in gift for ' + this.name + ':\n';
                giftContent.forEach((item, i) => giftInfo += (i + 1) +
                    '. weight: ' + item.weight + '\n');
                return giftInfo;
            }
            return false;
        }

        get status() {
            let giftInfo = 'Gift for ' + this.name + ':\n';
            this.items.forEach((item, i) => giftInfo += (i + 1) +
                '. name: ' + item.name +
                ', weight: ' + item.weight + '\n');
            return giftInfo;
        }
    }

    let gift1 = new Gift('Anton');
    let gift2 = new Gift('Dmitrii');
    let gift3 = new Gift('Ilon Mask');

    gift1.addItem(candy1).addItem(candy1).addItem(candy2).addItem(candy2).addItem(candy3);
    gift2.addItem(candy1).addItem(candy2).addItem(candy3).addItem(candy3);
    gift3.addItem(candy3);

    console.log(gift2.status);

    gift2.sortBy('weight');

    console.log('\nSorted by weight\n' + gift2.status);

    console.log('\n' + gift2.findName('Candy 3'));

}());
