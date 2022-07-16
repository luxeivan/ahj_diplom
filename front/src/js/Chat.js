import { merge, fromEvent, debounceTime, distinctUntilChanged, EMPTY } from 'rxjs';
import { map, switchMap, tap, catchError, filter } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'

export default class Chat {
    constructor() {
        this.url = 'http://localhost:3000';
        this.inputText = document.getElementById('input_text');
        this.inputSearch = document.querySelector('.chat__search-input');
        this.chatList = document.querySelector('.chat__list');
        this.chatListArea = document.querySelector('.chat__list-area');
        this.addFile = document.getElementById('add-file');
        this.init();
    }
    init() {
        this.getTenMessages().subscribe(res => {
            this.renderMessages(res);
        },
            error => {
                console.log(error);
            });


        //Подписка на ввод текста в основном инпуте
        fromEvent(document.querySelector('.chat__form'), 'submit')
            .pipe(
                tap(event => event.preventDefault()),
                map(event => this.inputText.value)
            ).subscribe(() => {
                if (this.inputText.value) this.addMessageToServer(this.inputText.value);
                //this.addMessageToChatList(this.inputText.value);
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
        ).pipe(map(event => this.inputSearch.value), switchMap((text)=>{return this.getTenMessages(0,text)}))
            .subscribe(res => {
                this.renderMessages(res, true, 'afterbegin', true);
            },
                error => {
                    console.log(error);
                });

        //подписка на события клика по иконке прикрепления файла
        fromEvent(document.querySelector('.attach-file'), 'click')
            .subscribe(event => {
                this.addFile.click()
            });

        //подписка на события прикрепления файла
        fromEvent(this.addFile, 'change')
            .subscribe(event => {
                if (!event.target.files.length) return;
                const reader = new FileReader()
                reader.onload = file => {
                    this.addMessageToServer(event.target.files[0].name, event.target.files[0].type, file.target.result)
                }

                reader.readAsDataURL(event.target.files[0]);
            })

        //подписка на события скрола сообщений
        fromEvent(this.chatListArea, 'scroll')
            .pipe(
                filter(event => this.chatListArea.scrollTop === 0),
                map(event => document.getElementsByClassName('chat__item').length),
                switchMap((first)=>{return this.getTenMessages(first,this.inputSearch.value)}),
                filter(arr => arr.length > 0)
            )
            .subscribe(res => {
                this.renderMessages(res, false);
            })
    }

    //Функция возвращает дату в нужном формате
    dateNow() {
        let a = new Date();
        return `${a.getDate()}-${a.getMonth() < 10 ? 0 + (a.getMonth() + 1).toString() : a.getMonth() + 1}-${a.getFullYear()} ${a.getHours() < 10 ? 0 + a.getHours().toString() : a.getHours()}:${a.getMinutes() < 10 ? 0 + a.getMinutes().toString() : a.getMinutes()}`;
    }

    //Добавить сообщение в интерфейс пользователя
    addMessageToChatList(message, type = 'text', data = '') {
        this.chatList.insertAdjacentHTML('beforeend', `
        <li class="chat__item">
        <div class="chat__item-content">${message}</div>  
        <div class="chat__item-time">${this.dateNow()}</div></li>`);
        this.scrollDown();
    }

    //Получить 10 сообщений в массиве начиная с указанной позиции
    getTenMessages(first = 0,searchText='') {
        return ajax.getJSON(`http://localhost:3000/messages?first=${first}&searchtext=${searchText}`)
            .pipe(
                catchError(err => {
                    console.log(err);
                    return EMPTY;
                }));
    }

    //Отправить сообщение на сервер
    addMessageToServer(message, type = 'text', data = '') {
        ajax({
            url: 'http://localhost:3000/add',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                type: type,
                message: message,
                date: this.dateNow(),
                data: data
            }
        }).subscribe(res => {
            if (res.response.ok) {
                this.renderMessages([{
                    type: type,
                    message: message,
                    date: this.dateNow(),
                    data: data
                }], true, 'beforeend')
            }
        })
    }

    //Получение с сервера сообщений содержащих искомую строку
    // getSearchMessages(text) {
    //     return ajax.getJSON('http://localhost:3000/messages?searchtext=' + text)
    //         .pipe(
    //             catchError(err => {
    //                 console.log(err);
    //                 return EMPTY;
    //             }));
    // }

    //Функция перемотки интерфейса вниз до самого свежего сообщения
    scrollDown() {
        this.chatListArea.scrollTop = this.chatListArea.scrollHeight - this.chatListArea.clientHeight;
    }

    //Отрисовка массива сообщений в интерфейсе
    renderMessages(messages, scroll = true, position = 'afterbegin', clear = false) {
        const oldScroll = this.chatListArea.scrollHeight;
        if (clear) this.chatList.innerHTML = '';

        messages.forEach(message => {
            let data = '';
            if (message.type.match('image') && message.data != '') {
                data = `<img src="${message.data}" class="chat__item-img"/>`
            }
            if (message.type.match('audio') && message.data != '') {
                data = `<audio src="${message.data}" controls class="chat__item-audio"/>`
            }
            if (message.type.match('video') && message.data != '') {
                data = `<video controls class="chat__item-video"><source src="${message.data}" /></video>`
            }
            this.chatList.insertAdjacentHTML(position, `
            <li class="chat__item">
            <div class="chat__item-content"><p class="chat__item-text">${message.message}</p>${data}</div>  
            <div class="chat__item-time">${message.date}</div></li>`);
        });
        const newScroll = this.chatListArea.scrollHeight;
        if (scroll) {
            this.scrollDown();
        } else {
            document.dispatchEvent(new Event('mouseup'));
            this.chatListArea.scrollTop = newScroll - oldScroll;
        }
    }

}