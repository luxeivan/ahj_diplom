
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators'
export default class Chat {
    constructor() {
        console.log('run chat');
        const input$ = fromEvent(document.getElementById('input_text'), 'input')
            .pipe(
                map(event => event.target.value)
            )
            input$.subscribe(text=>{
                console.log(text);
            });
    }
}