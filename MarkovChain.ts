class ChainItem {
    private static _NextId: number = 0;
    Id: number;
    Text: string;
    HitCount: number;
    Children: Array<ChainItem>;
    constructor(text: string) {
        this.Id = ChainItem._NextId;
        ChainItem._NextId++;
        this.Text = text;
        this.HitCount = 0;
        this.Children = new Array<ChainItem>();
    }
    IsTextInsideMe(text: string): boolean {
        let trues = new Array<ChainItem>();
        let finder = (items: Array<ChainItem>) => {
            if (items.length > 0) {
                for (let child of items) {
                    if (child.Text == text) {
                        trues.push(child);
                    } else {1
                        finder(child.Children);
                    }
                }
            }
        };
        return trues.length > 0;
    }
}


class Chain {
    private _ogInput: string;
    Input: string;
    ChainItems: Array<ChainItem>;
    constructor(inputText: string) {
        this._ogInput = inputText;
        this.Input = inputText;
        this.ChainItems = new Array<ChainItem>();
        this.initChain();
    }

    initChain() {
        let words = this.Input.split(" ");

        let sentenceEnders = ['.', '!', ';', '?'];

        let currChainItem: ChainItem = null;
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            if (!sentenceEnders.includes(word)) {
                if (currChainItem == null) {
                    if (this.ChainItems.filter(x => x.Text == word).length > 0) {
                        currChainItem = this.ChainItems.find(x => x.Text == word);
                        currChainItem.HitCount++;
                    } else {
                        this.ChainItems.push(new ChainItem(word));
                        currChainItem = this.ChainItems[this.ChainItems.length -1];
                    }
                } else {                    
                    if (currChainItem.Children.filter(x => x.Text == word).length > 0) {
                        currChainItem = currChainItem.Children.find(x => x.Text == word);
                        currChainItem.HitCount++;
                    } else {
                        let newItem = new ChainItem(word)
                        currChainItem.Children.push(newItem);
                        currChainItem = currChainItem.Children[currChainItem.Children.length -1];
                    }
                }
            } else {
                currChainItem = null;
            }
        }
    }

    predict() {
        //this.ChainItems.forEach(x => console.log(x.IsTextInsideMe(this.Input)));
    }
}


let chain = new Chain("Something, something else, something else; something.");
chain.predict();