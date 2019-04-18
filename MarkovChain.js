var ChainItem = /** @class */ (function () {
    function ChainItem(text) {
        this.Id = ChainItem._NextId;
        ChainItem._NextId++;
        this.Text = text;
        this.HitCount = 0;
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
        var sentenceEnders = ['.', '!', ';', '?'];
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
        //this.ChainItems.forEach(x => console.log(x.IsTextInsideMe(this.Input)));
    };
    return Chain;
}());
var chain = new Chain("Something, something else, something else; something.");
chain.predict();
