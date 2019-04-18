var ChainItem = /** @class */ (function () {
    function ChainItem(text) {
        this.Id = ChainItem._NextId;
        ChainItem._NextId++;
        this.Text = text;
        this.HitCount = 1;
        this.Children = new Array();
    }
    ChainItem.prototype.IsTextInsideMe = function (text) {
        var trues = new Array();
        var finder = function (items) {
            if (items.length > 0) {
                for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                    var child = items_1[_i];
                    if (child.Text == text) {
                        trues.push(child);
                    }
                    else {
                        1;
                        finder(child.Children);
                    }
                }
            }
        };
        return trues.length > 0;
    };
    ChainItem._NextId = 0;
    return ChainItem;
}());
var Chain = /** @class */ (function () {
    function Chain(inputText) {
        this._ogInput = inputText;
        this.Input = inputText;
        this.ChainItems = new Array();
        this.initChain();
    }
    Chain.prototype.initChain = function () {
        var words = this.Input.split(" ");
        var sentenceEnders = ['.', '!', ';', '?', '\r'];
        var currChainItem = null;
        var _loop_1 = function (i) {
            var word = words[i];
            if (!sentenceEnders.includes(word)) {
                if (currChainItem == null) {
                    if (this_1.ChainItems.filter(function (x) { return x.Text == word; }).length > 0) {
                        currChainItem = this_1.ChainItems.find(function (x) { return x.Text == word; });
                        currChainItem.HitCount++;
                    }
                    else {
                        this_1.ChainItems.push(new ChainItem(word));
                        currChainItem = this_1.ChainItems[this_1.ChainItems.length - 1];
                    }
                }
                else {
                    if (currChainItem.Children.filter(function (x) { return x.Text == word; }).length > 0) {
                        currChainItem = currChainItem.Children.find(function (x) { return x.Text == word; });
                        currChainItem.HitCount++;
                    }
                    else {
                        var newItem = new ChainItem(word);
                        currChainItem.Children.push(newItem);
                        currChainItem = currChainItem.Children[currChainItem.Children.length - 1];
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
        var pickBiggest = function (chainItems) { return chainItems.sort(function (a, b) { return a.HitCount - b.HitCount; })[0]; };
        var rPredict = function (item) {
            if (item.Children.length > 0) {
                var big = pickBiggest(item.Children);
                //@ts-ignore
                console.log(item.Children);
                predictionText += " " + big.Text;
                rPredict(big);
            }
        };
        rPredict(pickBiggest(this.ChainItems));
        return predictionText;
    };
    return Chain;
}());
var text = "I am Sam\nSam I am\nThat Sam-I-am!\nThat Sam-I-am!\nI do not like that Sam-I-am!\n\nDo you like \ngreen eggs and ham?\nI do not like them, Sam-I-am.\nI do not like\ngreen eggs and ham.\n\nWould you like them \nhere or there?\n\nI would not like them\nhere or there.\nI would not like them anywhere. \n\nI do not like\ngreen eggs and ham.\nI do not like them, Sam-I-am.\n\nWould you like them in a house?\nWould you like them with a mouse?\n\nI do not like them\nin a house.\nI do not like them\nwith a mouse.\nI do not like them\nhere or there.\nI do not like them\nanywhere.\nI do not like \ngreen eggs and ham.\nI do not like them, \nSam-I-am.\n\nWould you eat them\nin a box?\nWould you eat them\nwith a fox?\n\nNot in a box. \nNot with a fox.\nNot in a house.\nNot with a mouse.\nI would not eat them\nhere or there.\nI would not eat them anywhere.\nI would not eat green eggs and ham.\nI do not like them, Sam-I-am.\n\nWould you? Could you? In a car?\nEat them! Eat them! Here they are.\nI would not, could not, in a car.\n\nYou may like them. You will see. \nYou may like them in a tree!\n\nI would not, could not in a tree.\nNot in a car! You let me be.\n\nI do not like them in a box.\nI do not like them with a fox.\nI do not like them in a house.\nI do not like them with a mouse.\nI do not like them here or there.\nI do not like them anywhere.\nI do not like green eggs and ham.\nI do not like them, Sam-I-am.\n\nA train! A train!\nA train! A train!\nCould you, would you,\non a train?\n\nNot in a train! Not in a tree!\nNot in a car! Sam! Let me be!\n\nI would not, could not, in a box.\nI could not, would not, with a fox.\nI will not eat them with a mouse.\nI will not eat them in a house.\nI will not eat them here or there.\nI will not eat them anywhere.\nI do not like green eggs and spam.\nI do not like them, Sam-I-am.\n\nSay! In the dark?\nHere in the dark!\nWould you, could you,\nin the dark?\n\nI would not, could not, in the dark.\n\nWould you, could you, in the rain?\n\nI would not, could not, in the rain.\nNot in the dark. Not on a train.\nNot in a car. Not in a tree.\nI do not like them, Sam, you see.\nNot in a house. Not in a box.\nNot with a mouse. Not with a fox.\nI will not eat them here or there.\nI do not like them anywhere!\n\nYou do not like \ngreen eggs and ham?\nI do not like them,\nSam-I-am.\n\nCould you, would you, \nwith a goat?\n\nI would not, could not,\nwith a goat!\n\nWould you, could you,\non a boat?\n\nI could not, would not, \non a boat.\nI will not, will not, \nwith a goat.\n\nI will not eat them in the rain.\nI will not eat them on a train.\nNot in the dark! Not in a tree!\nNot in a car! You let me be!\nI do not like them in a box.\nI do not like them with a fox.\nI will not eat them in a house.\nI do not like them with a mouse.\nI do not like them here or there.\nI do not like them anywhere!\nI do not like green eggs and ham!\nI do not like them, Sam-I-am.\n\n\nYou do not like them. So you say.\nTry them! Try them! And you may.\nTry them and you may, I say.\n\nSam! If you will let me be,\nI will try them. You will see.\n\nSay! I like green eggs and ham!\nI do! I like them, Sam-I-am!\nAnd I would eat them in a boat.\nAnd I would eat them with a goat...\n\nAnd I will eat them in the rain.\nAnd in the dark. And on a train.\nAnd in a car. And in a tree.\nThey are so good, so good, you see!\n\nSo I will eat them in a box.\nAnd I will eat them with a fox.\nAnd I will eat them in a house.\nAnd I will eat them with a mouse.\nAnd I will eat them here and there.\nSay! I will eat them anywhere!\nI do so like\ngreen eggs and ham!\nThank you!\nThank you, Sam-I-am!";
var chain = new Chain(text);
//@ts-ignore
console.log(chain.predict());
