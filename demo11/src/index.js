import './index.less'
import testImg from './assets/images/image1.png';

class Test {
    constructor() {
        console.log('test');
        this.renderHello()
    }
    renderHello() {
        let divEl = document.getElementById('root');
        divEl.className = 'hello';
        divEl.innerHTML = 'Hello !!!!'
        let imgEl = document.createElement('img');
        imgEl.src = testImg;
        divEl.appendChild(imgEl);
    }
}
new Test()