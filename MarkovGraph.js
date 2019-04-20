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
        this.init();
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
        var _this = this;
        var lastNodeIdx = additionalInput !== undefined ? this._train(additionalInput) : 0;
        var lastNode = this.dict.items.find(function (x) { return x.id == lastNodeIdx; });
        var predictionData = lastNode.afterMe;
        var uniqueSorted = Array.from(new Set(predictionData))
            .sort(function (a, b) { return predictionData.filter(function (x) { return x === a; }).length - predictionData.filter(function (x) { return x === b; }).length; });
        var text = uniqueSorted.map(function (x) { return _this.dict.items.find(function (h) { return h.id == x; }); });
        return text.map(function (x) { return x.text; });
    };
    return Graph;
}());
var testData = JSON.parse(fs.readFileSync('./data/text.json', { encoding: 'UTF-8' }))['greenEggsAndHam'];
testData += fs.readFileSync('./data/abandoned.txt', { encoding: 'UTF-8' });
var testGraph = new Graph(testData);
var m = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
function go() {
    m.question("You: ", function (newInput) {
        m.close();
        console.log(testGraph.predict(newInput));
    });
}
;
go();
