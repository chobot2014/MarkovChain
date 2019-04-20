"use strict";
exports.__esModule = true;
var fs = require("fs");
var ChainItem = /** @class */ (function () {
    function ChainItem(text) {
        this.id = ChainItem._NextId;
        ChainItem._NextId++;
        this.text = text;
        this.hitCount = 1;
        this.children = new Array();
    }
    ChainItem._NextId = 0;
    return ChainItem;
}());
var DictionaryItem = /** @class */ (function () {
    function DictionaryItem(text) {
        Dictionary.highestId++;
        this.id = Dictionary.highestId;
        this.text = text;
    }
    return DictionaryItem;
}());
var Dictionary = /** @class */ (function () {
    function Dictionary() {
    }
    return Dictionary;
}());
var Chain = /** @class */ (function () {
    function Chain(inputText) {
        this._ogInput = inputText;
        this.input = inputText;
        this.chainItems = new Array();
        this.initDictionary();
        this.initChain();
    }
    Chain.prototype.initDictionary = function () {
        var rawEnglishDictionary = JSON.parse(fs.readFileSync("./data/englishDictionary.json", { encoding: 'UTF-8' }));
        //@ts-ignore
        this.dictionary.items = Object.keys(rawEnglishDictionary).reduce(function (acc, curr) { return acc.push(new DictionaryItem(curr)); }, []);
        var item = this.dictionary.items.find(function (x) { return x.text == word; });
        var prevItem = this.dictionary.items.find(function (x) { return x.text == words[i - 1]; });
        if (item !== undefined) {
            prevItem.afterMe.push(item.id);
            item.beforeMe.push(prevItem.id);
            item.text = words[i];
        }
        else {
            var newItem = new DictionaryItem(words[i]);
            prevItem.afterMe.push(newItem.id);
            newItem.beforeMe.push(prevItem.id);
            this.dictionary.items.push(newItem);
        }
    };
    Chain.prototype.initChain = function () {
        var words = this.input.split(" ");
        var sentenceEnders = ['.', '!', ';', '?', '\r'];
        var currChainItem = null;
        var _loop_1 = function (i) {
            var word = words[i];
            if (!sentenceEnders.includes(word)) {
                if (currChainItem == null) {
                    if (this_1.chainItems.filter(function (x) { return x.text == word; }).length > 0) {
                        currChainItem = this_1.chainItems.find(function (x) { return x.; });
                        currChainItem.hitCount++;
                    }
                    else {
                        this_1.chainItems.push(new ChainItem(word));
                        currChainItem = this_1.chainItems[this_1.chainItems.length - 1];
                    }
                }
                else {
                    if (currChainItem.children.filter(function (x) { return x.text == word; }).length > 0) {
                        currChainItem = currChainItem.children.find(function (x) { return x.text == word; });
                        currChainItem.hitCount++;
                    }
                    else {
                        var newItem = new ChainItem(word);
                        currChainItem.children.push(newItem);
                        currChainItem = currChainItem.children[currChainItem.children.length - 1];
                    }
                }
            }
            else {
                currChainItem = null;
            }
        };
        var this_1 = this;
        for (var i = 0; i < words.length; i++) {
            _loop_1(i);
        }
    };
    Chain.prototype.predict = function () {
        var predictionText = "";
        var pickBiggest = function (chainItems) { return chainItems.sort(function (a, b) { return a.hitCount - b.hitCount; })[0]; };
        var rPredict = function (item) {
            if (item.children.length > 0) {
                var big = pickBiggest(item.children);
                predictionText += " " + big.text;
                rPredict(big);
            }
        };
        rPredict(pickBiggest(this.chainItems));
        return predictionText;
    };
    return Chain;
}());
var text = JSON.parse(fs.readFileSync("./data/text.json", { encoding: 'UTF-8' }));
var chain = new Chain(text.greenEggsAndHam);
// //@ts-ignore
// console.log(chain.predict());
