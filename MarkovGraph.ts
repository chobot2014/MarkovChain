import * as fs from 'fs';

class DictionaryItem {
    id: number;
    text: string;
    beforeMe: Array<number>;
    afterMe: Array<number>;
    constructor(text: string) {
        Dictionary.highestId = Dictionary.highestId + 1;
        this.id = Dictionary.highestId;
        this.text = text;
        this.beforeMe = [];
        this.afterMe = [];
    }
}

class Dictionary {
    static highestId: number = 0;
    items: Array<DictionaryItem>;
}

class Graph {
    dict: Dictionary;
    inputText: string;
    constructor(text: string) {
        this.inputText = text;
        this.dict = new Dictionary();
        this.init();
    }
    private _train(inputString): number {
        let lastNode;
        inputString.split(' ')
            .forEach((currentWord, i, words) => {
                let itemRef = this.dict.items.find(x => x.text == currentWord);
                if (itemRef === undefined) {
                    let a = new DictionaryItem(currentWord);
                    this.dict.items.push(a);
                    itemRef = this.dict.items.find(x => x.id == a.id);
                }
                let prevItem = this.dict.items.find(x => x.text == words[i - 1]);
                if (prevItem !== undefined) {
                    prevItem.afterMe.push(itemRef.id);
                    itemRef.beforeMe.push(prevItem.id);
                }
                lastNode = itemRef.id;
            });
        return lastNode;
    }

    init() {
        let rawEnglishDictionary = JSON.parse(fs.readFileSync("./data/englishDictionary.json", { encoding: 'UTF-8' }));
        this.dict.items = Object.keys(rawEnglishDictionary).reduce((acc: Array<DictionaryItem>, curr) => {
            acc.push(new DictionaryItem(curr));
            return acc;
        }, []);
        this._train(this.inputText);
    }

    predict(additionalInput?) {
        let lastNodeIdx = additionalInput !== undefined ? this._train(additionalInput) : 0;
        let lastNode = this.dict.items.find(x => x.id == lastNodeIdx);
        let predictionData = lastNode.afterMe;
        let uniqueSorted = Array.from(new Set(predictionData))
            .sort((a, b) => predictionData.filter(x => x === a).length - predictionData.filter(x => x === b).length);
        let text = uniqueSorted.map(x => this.dict.items.find(h => h.id == x));
        return text.map(x => x.text);
    }
}

let testData = JSON.parse(fs.readFileSync('./data/text.json', { encoding: 'UTF-8' }))['greenEggsAndHam'];
let testGraph = new Graph(testData);

const m = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function go() {
    m.question("You: ", newInput => {
        m.close();
        console.log(testGraph.predict(newInput));
    });
};
go();
