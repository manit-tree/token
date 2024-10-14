interface IDog {
    walk():void;
}

export default class Dog implements IDog {
    walk():void {
        console.log('Dog is walking!');
    }
}