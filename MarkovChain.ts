import * as fs from 'fs';

class ChainItem {
    private static _NextId: number = 0;
    id: number;
    text: string;
    hitCount: number;
    children: Array<ChainItem>;
    constructor(text: string) {
        this.id = ChainItem._NextId;
        ChainItem._NextId++;
        this.text = text;
        this.hitCount = 1;
        this.children = new Array<ChainItem>();
    }
}

class DictionaryItem {
    id: number;
    text: string;
    beforeMe: Array<number>;
    afterMe: Array<number>;
    constructor(text: string) {
        Dictionary.highestId++;
        this.id = Dictionary.highestId;
        this.text = text;
    }
}

class Dictionary {
    static highestId: number;
    items: Array<DictionaryItem>;
}


class Chain {
    private _ogInput: string;
    input: string;
    chainItems: Array<ChainItem>;
    dictionary: Dictionary;

    constructor(inputText: string) {
        this._ogInput = inputText;
        this.input = inputText;
        this.chainItems = new Array<ChainItem>();
        this.initDictionary();
        this.initChain();
    }

    initDictionary() {
        let rawEnglishDictionary = JSON.parse(fs.readFileSync("./data/englishDictionary.json", {encoding: 'UTF-8'}));
        //@ts-ignore
        this.dictionary.items = Object.keys(rawEnglishDictionary).reduce((acc: Array<DictionaryItem>, curr) =>
            acc.push(new DictionaryItem(curr)),[]);
        
        // let item = this.dictionary.items.find(x => x.text == word);
        //             let prevItem = this.dictionary.items.find(x => x.text == words[i -1]);
        //             if (item !== undefined) {                        
        //                 prevItem.afterMe.push(item.id);
        //                 item.beforeMe.push(prevItem.id);
        //                 item.text = words[i];
        //             } else {
        //                 let newItem = new DictionaryItem(words[i]);
        //                 prevItem.afterMe.push(newItem.id);
        //                 newItem.beforeMe.push(prevItem.id);                        
        //                 this.dictionary.items.push(newItem);
        //             }
        console.log(this.dictionary.items);
    }


    // initChain() {
    //     let words = this.input.split(" ");

    //     let sentenceEnders = ['.', '!', ';', '?', '\r'];

    //     let currChainItem: ChainItem = null;
    //     for (let i = 0; i < words.length; i++) {
    //         let word = words[i];
    //         if (!sentenceEnders.includes(word)) {
    //             if (currChainItem == null) {                    
    //                 if (this.chainItems.filter(x => x.text == word).length > 0) {
    //                     currChainItem = this.chainItems.find(x => x.);
    //                     currChainItem.hitCount++;
    //                 } else {
    //                     this.chainItems.push(new ChainItem(word));
    //                     currChainItem = this.chainItems[this.chainItems.length -1];
    //                 }
    //             } else {                    
    //                 if (currChainItem.children.filter(x => x.text == word).length > 0) {
    //                     currChainItem = currChainItem.children.find(x => x.text == word);
    //                     currChainItem.hitCount++;
    //                 } else {
    //                     let newItem = new ChainItem(word)
    //                     currChainItem.children.push(newItem);
    //                     currChainItem = currChainItem.children[currChainItem.children.length -1];
    //                 }
    //             }
    //         } else {
    //             currChainItem = null;
    //         }
    //     }
    // }

    predict(): string {
        let predictionText = "";
        let pickBiggest = (chainItems: Array<ChainItem>) => chainItems.sort((a, b) => a.hitCount - b.hitCount)[0];
        let rPredict = (item: ChainItem) => {
            if (item.children.length > 0) {
                let big = pickBiggest(item.children);
                predictionText += ` ${big.text}`;
                rPredict(big);
            }            
        };
        rPredict(pickBiggest(this.chainItems));
        return predictionText;
    }
}

let text = JSON.parse(fs.readFileSync("./data/text.json", {encoding: 'UTF-8'}));
let chain = new Chain(text.greenEggsAndHam);

// //@ts-ignore
// console.log(chain.predict());