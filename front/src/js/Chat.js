import { merge, fromEvent, debounceTime, distinctUntilChanged, EMPTY } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'

export default class Chat {
    constructor() {
        console.log('run chat');
        this.url = 'http://localhost:3000';
        this.inputText = document.getElementById('input_text');
        this.inputSearch = document.querySelector('.chat__search-input');
        this.chatList = document.querySelector('.chat__list');
        this.chatListArea = document.querySelector('.chat__list-area');
        this.init();
    }
    init() {
        window.onload = this.scrollDown()

        //Подписка на ввод текста в основном инпуте
        fromEvent(document.querySelector('.chat__form'), 'submit')
            .pipe(
                tap(event => event.preventDefault()),
                map(event => this.inputText.value)
            ).subscribe(() => {
                if (this.inputText.value) this.addMessageToChatList(this.inputText.value);
                this.inputText.value = '';
            });

        //подписка на событие поиска ввод текста и кнопка поиска
        merge(
            fromEvent(document.querySelector('.chat__search'), 'click'),
            fromEvent(document.querySelector('.chat__search-input'), 'input')
                .pipe(      
                    map(event => event.target.value),             
                    debounceTime(1000),
                    distinctUntilChanged()
                )
        ).pipe(map(event => this.inputSearch.value),switchMap(this.getSearchMessages.bind(this)))
            .subscribe(res => {
                // if (this.inputSearch.value)
                //     console.log('Search: ', this.inputSearch.value);
                console.log(res);
                this.renderMessages(res);
            },
                error => {
                    console.log(error);
                });

        //подписка на события прикрепления файла
        fromEvent(document.querySelector('.attach-file'), 'click')
            .subscribe(event => {
                console.log('Attach');
            });
    }
    scrollDown() {
        this.chatListArea.scrollTop = this.chatListArea.scrollHeight - this.chatListArea.clientHeight;
    }
    dateNow() {
        let a = new Date();
        return `${a.getDate()}-${a.getMonth() < 10 ? 0 + (a.getMonth() + 1).toString() : a.getMonth() + 1}-${a.getFullYear()} ${a.getHours()}:${a.getMinutes()}`;
    }

    addMessageToChatList(message, type = 'text') {
        this.chatList.insertAdjacentHTML('beforeend', `
        <li class="chat__item">
        <div class="chat__item-content">${message}</div>  
        <div class="chat__item-time">${this.dateNow()}</div></li>`);
        this.scrollDown();
    }

    getTenMessages() {
        let first = 0;
        return ajax.getJSON(`http://localhost:3000/all?first=${first}`)
            .pipe(
                catchError(err => {
                    console.log(err);
                    return EMPTY;
                }));
    }
    getSearchMessages(text) {
        return ajax.getJSON('http://localhost:3000/messages?searchtext=' + text)
            .pipe(
                catchError(err => {
                    console.log(err);
                    return EMPTY;
                }));
    }

    renderMessages(messages) {
        this.chatList.innerHTML = '';
        messages.forEach(message=>{
            this.chatList.insertAdjacentHTML('beforeend', `
            <li class="chat__item">
            <div class="chat__item-content">${message.message}</div>  
            <div class="chat__item-time">${message.date}</div></li>`);
        });
        
        this.scrollDown();
    }

}