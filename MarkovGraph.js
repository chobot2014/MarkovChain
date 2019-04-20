"use strict";
exports.__esModule = true;
var fs = require("fs");
var DictionaryItem = /** @class */ (function () {
    function DictionaryItem(text) {
        Dictionary.highestId = Dictionary.highestId + 1;
        this.id = Dictionary.highestId;
        this.text = text;
        this.beforeMe = [];
        this.afterMe = [];
    }
    return DictionaryItem;
}());
var Dictionary = /** @class */ (function () {
    function Dictionary() {
    }
    Dictionary.highestId = 0;
    return Dictionary;
}());
var Graph = /** @class */ (function () {
    function Graph(text) {
        this.inputText = text;
        this.dict = new Dictionary();
    }
    Graph.prototype._train = function (inputString) {
        var _this = this;
        var lastNode;
        inputString.split(' ')
            .forEach(function (currentWord, i, words) {
            var itemRef = _this.dict.items.find(function (x) { return x.text == currentWord; });
            if (itemRef === undefined) {
                var a_1 = new DictionaryItem(currentWord);
                _this.dict.items.push(a_1);
                itemRef = _this.dict.items.find(function (x) { return x.id == a_1.id; });
            }
            var prevItem = _this.dict.items.find(function (x) { return x.text == words[i - 1]; });
            if (prevItem !== undefined) {
                prevItem.afterMe.push(itemRef.id);
                itemRef.beforeMe.push(prevItem.id);
            }
            lastNode = itemRef.id;
        });
        return lastNode;
    };
    Graph.prototype.init = function () {
        var rawEnglishDictionary = JSON.parse(fs.readFileSync("./data/englishDictionary.json", { encoding: 'UTF-8' }));
        this.dict.items = Object.keys(rawEnglishDictionary).reduce(function (acc, curr) {
            acc.push(new DictionaryItem(curr));
            return acc;
        }, []);
        this._train(this.inputText);
    };
    Graph.prototype.predict = function (additionalInput) {
        if (additionalInput !== undefined)
            return this._train(additionalInput);
    };
    return Graph;
}());
var greenEggsAndHam = JSON.parse(fs.readFileSync('./data/text.json', { encoding: 'UTF-8' }))['greenEggsAndHam'];
var testGraph = new Graph(greenEggsAndHam);
testGraph.init();
var currentNode = testGraph.predict("I will");
var q = testGraph.dict.items.find(function (x) { return x.id == currentNode; });
var uniqueSorted = Array.from(new Set(q.afterMe))
    .sort(function (a, b) { return q.afterMe.filter(function (x) { return x === a; }).length - q.afterMe.filter(function (x) { return x === b; }).length; });
console.log(uniqueSorted.map(function (x) { return testGraph.dict.items.filter(function (a) { return a.id == x; }); }));
// let usedDict = testGraph.dict.items.filter(x => x.afterMe.length > 0);
// console.log(usedDict);
// let usedDict = testGraph.dict.items.filter(x => x.afterMe.length > 0);
// let searcher = (item) => {
//     if (item.afterMe.length > 0) {
//         let tempDict = item.afterMe.map(x => usedDict.find(m => m.id == x));
//         searcher(tempDict.sort((a, b) => b.afterMe.length - a.afterMe.length)[0])
//     }
// };
// searcher(usedDict.sort((a, b) => b.afterMe.length - a.afterMe.length)[0]);
