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
        this.HitCount = 1;
        this.Children = new Array<ChainItem>();
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

        let sentenceEnders = ['.', '!', ';', '?', '\r'];

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

    predict(): string {
        let predictionText = "";
        let pickBiggest = (chainItems: Array<ChainItem>) => chainItems.sort((a, b) => a.HitCount - b.HitCount)[0];
        let rPredict = (item: ChainItem) => {
            if (item.Children.length > 0) {
                let big = pickBiggest(item.Children);
                //@ts-ignore
                console.log(item.Children);
                predictionText += ` ${big.Text}`;
                rPredict(big);
            }            
        };
        rPredict(pickBiggest(this.ChainItems));
        return predictionText;
    }
}


let text = `I am Sam
Sam I am
That Sam-I-am!
That Sam-I-am!
I do not like that Sam-I-am!

Do you like 
green eggs and ham?
I do not like them, Sam-I-am.
I do not like
green eggs and ham.

Would you like them 
here or there?

I would not like them
here or there.
I would not like them anywhere. 

I do not like
green eggs and ham.
I do not like them, Sam-I-am.

Would you like them in a house?
Would you like them with a mouse?

I do not like them
in a house.
I do not like them
with a mouse.
I do not like them
here or there.
I do not like them
anywhere.
I do not like 
green eggs and ham.
I do not like them, 
Sam-I-am.

Would you eat them
in a box?
Would you eat them
with a fox?

Not in a box. 
Not with a fox.
Not in a house.
Not with a mouse.
I would not eat them
here or there.
I would not eat them anywhere.
I would not eat green eggs and ham.
I do not like them, Sam-I-am.

Would you? Could you? In a car?
Eat them! Eat them! Here they are.
I would not, could not, in a car.

You may like them. You will see. 
You may like them in a tree!

I would not, could not in a tree.
Not in a car! You let me be.

I do not like them in a box.
I do not like them with a fox.
I do not like them in a house.
I do not like them with a mouse.
I do not like them here or there.
I do not like them anywhere.
I do not like green eggs and ham.
I do not like them, Sam-I-am.

A train! A train!
A train! A train!
Could you, would you,
on a train?

Not in a train! Not in a tree!
Not in a car! Sam! Let me be!

I would not, could not, in a box.
I could not, would not, with a fox.
I will not eat them with a mouse.
I will not eat them in a house.
I will not eat them here or there.
I will not eat them anywhere.
I do not like green eggs and spam.
I do not like them, Sam-I-am.

Say! In the dark?
Here in the dark!
Would you, could you,
in the dark?

I would not, could not, in the dark.

Would you, could you, in the rain?

I would not, could not, in the rain.
Not in the dark. Not on a train.
Not in a car. Not in a tree.
I do not like them, Sam, you see.
Not in a house. Not in a box.
Not with a mouse. Not with a fox.
I will not eat them here or there.
I do not like them anywhere!

You do not like 
green eggs and ham?
I do not like them,
Sam-I-am.

Could you, would you, 
with a goat?

I would not, could not,
with a goat!

Would you, could you,
on a boat?

I could not, would not, 
on a boat.
I will not, will not, 
with a goat.

I will not eat them in the rain.
I will not eat them on a train.
Not in the dark! Not in a tree!
Not in a car! You let me be!
I do not like them in a box.
I do not like them with a fox.
I will not eat them in a house.
I do not like them with a mouse.
I do not like them here or there.
I do not like them anywhere!
I do not like green eggs and ham!
I do not like them, Sam-I-am.


You do not like them. So you say.
Try them! Try them! And you may.
Try them and you may, I say.

Sam! If you will let me be,
I will try them. You will see.

Say! I like green eggs and ham!
I do! I like them, Sam-I-am!
And I would eat them in a boat.
And I would eat them with a goat...

And I will eat them in the rain.
And in the dark. And on a train.
And in a car. And in a tree.
They are so good, so good, you see!

So I will eat them in a box.
And I will eat them with a fox.
And I will eat them in a house.
And I will eat them with a mouse.
And I will eat them here and there.
Say! I will eat them anywhere!
I do so like
green eggs and ham!
Thank you!
Thank you, Sam-I-am!`;




let chain = new Chain(text);

//@ts-ignore
console.log(chain.predict());