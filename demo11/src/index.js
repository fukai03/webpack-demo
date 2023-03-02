import './index.less'
import testImg from './assets/images/image1.png';
import '../mock/index';
import axios from 'axios';


class Test {
    constructor() {
        console.log('test');
        this.renderHello()
    }
    async renderHello() {
        let divEl = document.getElementById('root');
        divEl.className = 'hello';
        divEl.innerHTML = 'Hello !!!!'
        let imgEl = document.createElement('img');
        imgEl.src = testImg;
        divEl.appendChild(imgEl);

        const res = await axios.get('/mock/longdata')
        console.log(res);
    }
}
new Test()