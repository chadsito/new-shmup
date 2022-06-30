//////////////////////////
// INPUT gamebuttons deberia estar dentro de game.js
//////////////////////////

class Input {
	constructor() {
		this.enabled = true;
		this.raw = new Array(5).fill(0);
		this.buttons = new Array(5).fill(0);

		// this.inputHistory = [];
		// this.savedInputs = localStorage.getItem('savedInputs') || [];
		// this.savedInputs = typeof this.savedInputs === 'string' ? JSON.parse(this.savedInputs) : [];

		// Keyboard events
		window.addEventListener('keydown', key => {
			this.updateRaw(key.code, this.raw, 1);
			// console.log(key.code)
		})
		window.addEventListener('keyup', key => {
			this.updateRaw(key.code, this.raw, 0);
		})
		// Unnecesary ?
		window.addEventListener('visibilitychange', e => {
			if (e.target.visibilityState === 'hidden') {
				this.raw.fill(0);
			};
		})

		// Touch event
		let shotBtn = document.querySelector('.shot'), analog = document.querySelector('.analog');	
		shotBtn.addEventListener('touchstart',e=>this.raw[4] = 1)
		shotBtn.addEventListener('touchend',  e=>this.raw[4] = 0)
		analog.addEventListener('touchstart', e=>this.analogMove(e.targetTouches[0], e, this.raw))
		analog.addEventListener('touchmove',  e=>this.analogMove(e.targetTouches[0], e, this.raw))
		analog.addEventListener('touchend',  ()=>this.raw.splice(0,4,...[0,0,0,0]))
	}
	analogMove(touch, e, raw){
		let axisX = (touch.clientX-touch.target.offsetLeft-(touch.target.clientWidth/2));
		let axisY = (touch.clientY-touch.target.offsetTop-(touch.target.clientHeight/2));
		
		if (axisX <= -25) raw[3] = 1; else raw[1] = 1;
		if (axisY <= -25) raw[0] = 1; else raw[2] = 1;

		if (axisX > -25 && axisX < 25) raw[3] = raw[1] = 0;
		if (axisY > -25 && axisY < 25) raw[0] = raw[2] = 0;
		e.returnValue = false;
	}

	updateRaw (keyCode, arr, pressed) {
		// Switch case es mas economico en bytes que if
		switch(keyCode){
			case 'ArrowUp':   return arr[0] = pressed;
			case 'ArrowRight':return arr[1] = pressed;
			case 'ArrowDown': return arr[2] = pressed;
			case 'ArrowLeft': return arr[3] = pressed;
			case 'KeyZ':      return arr[4] = pressed;
			// Ojo este boton no se esta usando
			// case 'KeyX':      return arr[5] = pressed;
		}
	}

	updateButtons () {
		if (!this.enabled) return this.buttons.fill(0);
		// Write state (1, 2, or 0) into this.buttons
		for (const i in this.raw) {
			if(this.raw[i] && this.buttons[i] < 2) this.buttons[i]++;
			if(!this.raw[i]) this.buttons[i] = 0;
		}
	}
};