/** @type {HotelId[]} */
const VALID_HOTELS = ["com", "com.br", "com.es"];

class Sequence {
	/** @type {SequenceArray} */
	#list = [];
	/** @type {SequenceFreezedArray} */
	#_list = null;

	/** @param {SequenceStepModifier} handler */
	step(handler) {
		this.#list.push(handler);
		return this;
	}

	/** @param {SequenceStepDelay} duration */
	delay(duration) {
		this.#list.push(duration);
		return this;
	}

	freeze() {
		this.#list = this.#_list = Object.freeze(this.#list);
		return this.#_list;
	}
	get list() {
		return this.#_list ?? this.#list;
	}
}

class Avatar {
	/** @type {HotelId} */
	hotel = null;
	/** @type {string} */
	nickname = null;
	/** @type {string} */
	figure = null;
	/** @type {HTMLImageElement} */
	#img = null;

	/**
	 * @typedef AvatarState
	 * @property {Direction} headDirection
	 * @property {Direction} bodyDirection
	 * @property {Gesture} gesture
	 * @property {Action[]} action
	 * @property {number} handItem
	 * @property {number} signItem
	 * @property {number} frame
	 * @property {boolean} headOnly
	 */

	/** @type {AvatarState} */
	#state = null;

	/** @type {boolean} */
	#shouldUpdate = true;

	/** @type {{ [actionName: string]: number }} */
	#actionTimeouts = {};

	constructor(container) {
		this.hotel = container.getAttribute("data-hotel") ?? "com";
		if (this.hotel.includes("/")) this.hotel = "com";

		this.nickname = container.getAttribute("data-nickname");
		this.figure = container.getAttribute("data-figure");

		this.#img = document.createElement("img");
		container.appendChild(this.#img);

		this.reset();
	}

	reset() {
		for (const actionId in this.#actionTimeouts) {
			clearTimeout(this.#actionTimeouts[actionId]);
			delete this.#actionTimeouts[actionId];
		}

		this.#shouldUpdate = true;
		this.#state = {
			headDirection: 2,
			bodyDirection: 2,
			gesture: "none",
			action: [],
			handItem: 0,
			signItem: 0,
			frame: 0,
			// size: 'b', // s | m | l
			headOnly: false,
		};
	}

	render() {
		if (!this.#shouldUpdate) return;

		if (!(this.nickname || this.figure))
			throw new Error("Nickname or Figure should be defined.");

		const params = new URLSearchParams();
		if (this.figure) params.set("figure", this.figure);
		else if (this.nickname) params.set("user", this.nickname);
		params.set("direction", this.#state.bodyDirection);
		params.set("head_direction", this.#state.headDirection);

		if (this.#state.gesture !== "none") {
			params.set("gesture", this.#state.gesture);
		}

		let actions = [];
		let handItemActions = ["crr", "drk"];
		let ignoreHandItemActions = [];
		for (const action of this.#state.action) {
			if (action === "wlk") actions.unshift(action);
			else if (ignoreHandItemActions.includes(action)) continue;
			else if (handItemActions.includes(action)) {
				actions.push([action, this.#state.handItem].join("="));
				ignoreHandItemActions = handItemActions.filter(
					(x) => x !== action
				);
			} else if (action === "sig")
				actions.push([action, this.#state.signItem].join("="))
			else actions.push(action);
		}
		if (actions.length) params.set("action", actions.join(","));

		let frameLimit = 1;
		if (this.#state.action.includes("wav")) frameLimit = 2;
		else if (this.#state.action.includes("wlk")) frameLimit = 4;
		this.#state.frame = (this.#state.frame + 1) % frameLimit;
		params.set("frame", this.#state.frame);

		if (this.#state.headOnly) {
			params.set("headonly", 1);
		}

		if (this.#img.complete) {
			this.#img.src = `https://www.habbo.${
				this.hotel
			}/habbo-imaging/avatarimage?${params.toString()}`;
			this.#img.classList.remove("loading");
		} else {
			this.#img.classList.add("loading");
		}

		if (
			!this.#state.action.includes("wav") &&
			!this.#state.action.includes("wlk")
		)
			this.#shouldUpdate = false;
	}

	#activeActionWithDuration(action, property, duration = Infinity) {
		this.#shouldUpdate = true;
		if (duration <= 0) {
			if (this.#actionTimeouts[action]) {
				clearTimeout(this.#actionTimeouts[action]);
				delete this.#actionTimeouts[action];
			}

			let index = this.#state.action.indexOf(action);
			if (index >= 0) this.#state.action.splice(index, 1);
			return;
		}
		if (!this.#state.action.includes(action)) {
			this.#state.action.push(action);
		}

		if (duration < Infinity) {
			if (this.#actionTimeouts[action])
				clearTimeout(this.#actionTimeouts[action]);
			this.#actionTimeouts[action] = setTimeout(() => {
				this[property] = 0;
				delete this.#actionTimeouts[action];
			}, duration * 1000);
		}
	}

	// TODO: make the mutually exclusive actions stop the previous timeout
	set walk(duration = Infinity) {
		this.#activeActionWithDuration("wlk", "walk", duration);
	}

	set wave(duration = Infinity) {
		this.#activeActionWithDuration("wav", "wave", duration);
	}

	set sit(duration = Infinity) {
		this.#activeActionWithDuration("sit", "sit", duration);
	}

	set lay(duration = Infinity) {
		this.#activeActionWithDuration("lay", "lay", duration);
	}

	set handItem(item = 0) {
		this.#state.handItem = item;
	}

	set carry(duration = Infinity) {
		// TODO:
		// - External texts: https://www.habbo.com/gamedata/external_flash_texts/1
		//   searching for handitemX
		//   but needs a map as the ids doesn't match
		// - Handitens table: https://docs.google.com/spreadsheets/d/1_zWGPEpU9b2e4NIW46qr9T_-1cBFlueORMYYsY8nKqw/view#gid=1654097078
		this.#activeActionWithDuration("crr", "carry", duration);
	}

	set drink(duration = Infinity) {
		this.#activeActionWithDuration("drk", "drink", duration);
	}

	set signItem(item = 0) {
		this.#state.signItem = item;
	}

	set sign(duration = Infinity) {
		this.#activeActionWithDuration("sig", "sign", duration);
	}

	set direction(dir = 2) {
		this.#shouldUpdate = true;
		if (Array.isArray(dir)) {
			if (typeof dir[0] === "number") this.#state.headDirection = dir[0];
			if (typeof dir[1] === "number") this.#state.bodyDirection = dir[1];
		} else if (typeof dir === "number") {
			this.#state.headDirection = dir;
			this.#state.bodyDirection = dir;
		}
	}

	/** @param {Gesture} gesture */
	set gesture(gesture = "none") {
		// TODO: missing: eye blinking and speaking (has 2 frames)
		if (["eyb", "spk"].includes(gesture)) console.trace("TODO");
		this.#shouldUpdate = true;
		if (!["sml", "srp", "sad", "agr"].includes(gesture))
			this.#state.gesture = "none";
		else this.#state.gesture = gesture;
	}

	set headOnly(on = true) {
		this.#shouldUpdate = true;
		this.#state.headOnly = on;
	}
}

class AvatarAnimation {
	#rendering = true;
	#updating = true;

	/** @type {Avatar} */
	#avatar = null;
	/** @type {SequenceFreezedArray} */
	#originalSequence = null;
	/** @type {boolean} */
	#loop = null;

	/** @type {SequenceArray} */
	#currentSequence = null;
	/** @type {number} */
	#timingThen;
	/** @type {number} */
	#delay;
	/** @type {boolean} */
	#waiting2Reset;

	/**
	 * @param {Avatar} avatar
	 * @param {SequenceFreezedArray} sequence
	 * @param {boolean} [loop=false]
	 */
	constructor(avatar, sequence, loop = false) {
		this.#avatar = avatar;
		this.#originalSequence = sequence;
		this.#loop = loop;

		this.#currentSequence = sequence.slice();
		this.#timingThen = Date.now();
		this.#delay = 0;
		this.#waiting2Reset = false;
	}

	/** @param {number} now */
	update(now) {
		if (!this.#updating) return;

		const elapsed = now - this.#timingThen;

		if (
			this.#loop &&
			!this.#currentSequence.length &&
			!this.#waiting2Reset
		) {
			if (this.#delay) {
				this.#waiting2Reset = true;
				setTimeout(() => {
					this.#waiting2Reset = false;
					this.reset();
				}, this.#delay);
			} else {
				this.reset();
			}
		}

		if (this.#currentSequence.length && elapsed > this.#delay) {
			const step = this.#currentSequence.shift();
			if (typeof step === "number") {
				this.#delay = step * 1000;
			} else if (typeof step === "function") {
				try {
					step(this.#avatar);
				} catch (err) {
					console.error(err);
				}
				this.#delay = 0;
				while (typeof this.#currentSequence[0] === "number") {
					this.#delay += this.#currentSequence.shift() * 1000;
				}
			}

			this.#timingThen = now;
		}
	}

	render() {
		if (!this.#rendering) return;

		this.#avatar.render();
	}

	get isPlaying() {
		return this.#rendering;
	}

	play() {
		this.#rendering = true;
		this.#updating = true;
	}
	pause(includingUpdates = true) {
		this.#rendering = false;
		this.#updating = !includingUpdates;
	}
	stop() {
		this.pause();
		this.reset();
		this.#avatar.render();
	}

	reset() {
		this.#currentSequence = this.#originalSequence.slice();
		this.#avatar.reset();
	}
}

class AnimationController {
	#rendering = false;

	/** @type {number} */
	#fps = null;
	/** @type {number} */
	#interval = null;
	#timingThen = Date.now();

	/** @type {AvatarAnimation[]} */
	#animations = [];

	/** @param {number} fps */
	constructor(fps) {
		this.fps = fps;
	}

	set fps(fps) {
		this.#fps = fps;
		this.#interval = 1000 / fps;
	}
	get fps() {
		return this.#fps;
	}

	#loop() {
		if (!this.#rendering) return;

		const now = Date.now();
		const elapsed = now - this.#timingThen;

		if (elapsed > this.#interval) {
			this.#timingThen = now - (elapsed % this.#interval);
			this.#update(now);
			this.#render();
		}

		requestAnimationFrame(this.#loop.bind(this));
	}

	/** @param {number} now */
	#update(now) {
		for (const animation of this.#animations) {
			animation.update(now);
		}
	}

	#render() {
		for (const animation of this.#animations) {
			try {
				animation.render();
			} catch (err) {
				console.error(err);
			}
		}
	}

	get isPlaying() {
		return this.#rendering;
	}

	play() {
		this.#rendering = true;
		this.#loop();
	}
	pause() {
		this.#rendering = false;
	}
	stop() {
		this.pause();
		for (const animation of this.#animations) {
			animation.reset();
		}
		this.#render();
	}

	/** @param {Animation} animation */
	addAnimation(animation) {
		this.#animations.push(animation);
	}
}
