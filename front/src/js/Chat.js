
import { fromEvent } from 'rxjs';
import { map,tap } from 'rxjs/operators'
export default class Chat {
    constructor() {
        console.log('run chat');
        this.inputText = document.getElementById('input_text');
        this.init();
    }
    init(){
        fromEvent(document.querySelector('.chat__form'), 'submit')
        .pipe(
            tap(event=>event.preventDefault()),
            map(event => this.inputText.value)
        ).subscribe(text=>{
            this.inputText.value = '';
            console.log(text);
        });

        fromEvent(document.querySelector('.chat__search'), 'click')        
        .subscribe(event=>{
            console.log('Search');
        });

        fromEvent(document.querySelector('.attach-file'), 'click')        
        .subscribe(event=>{
            console.log('Attach');
        });
    }
    
}