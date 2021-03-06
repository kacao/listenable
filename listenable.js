function isFunction(func) {
  return (typeof func === 'function');
}

exports = module.exports = class Listenable {

	constructor(id) {
    if ((typeof id != 'string') || (id == '')) { throw "id required"; }
		this._id = id;
		this._callbacks = {};
	}

	on(event, func) {
		if (isFunction(func)) {
			if (!Array.isArray(this._callbacks[event])) {
				this._callbacks[event] = [];
			}
			this._callbacks[event].push(func);
		} else { throw "not a function" };
    return this;
	}

	async emit(event) {
		let funcList = this._callbacks[event];
		let args = Array.prototype.slice.call(arguments, 1);
    let p = [];
		if (Array.isArray(funcList)) {
			for (let i=0; i<funcList.length; i++) {
				p.push(funcList[i].apply(this, args));
			}
		}
    return await Promise.all(p);
	}

  get id() {
    return this._id;
  }

	get state() {
		return this._state;
	}

	// set current state and fire change event
	set state(newState) {
		let oldState = this._state;
		this._state = newState;
		this.emit('stateChanged', {id: this._id, oldState: oldState, newState: this._state});
	}

}

