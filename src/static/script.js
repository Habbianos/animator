document
	.querySelectorAll("form")
	.forEach((elem) =>
		elem.addEventListener("submit", (e) => e.preventDefault())
	);

const sequences = loadSequences();

/** @param {Map<string, SequenceFreezedArray>} sequences */
function loadSequences(sequences = new Map()) {
	// time-based
	sequences.set(
		"default",
		new Sequence()
			.step((a) => (a.walk = 2))
			.delay(1)
			.step((a) => (a.direction = [3, null]))
			.step((a) => (a.gesture = "sml"))
			.delay(0.5)
			.step((a) => {
				a.direction = 3;
				a.wave = 3;
			})
			.delay(4)
			.freeze()
	);

	// frame-based
	sequences.set(
		"rotate",
		new Sequence()
			.step((a) => {
				a.gesture = "srp";
				a.direction = 2;
			})
			.step((a) => (a.direction = 3))
			.step((a) => (a.direction = 4))
			.step((a) => (a.direction = 5))
			.step((a) => (a.direction = 6))
			.step((a) => (a.direction = 7))
			.step((a) => (a.direction = 0))
			.step((a) => (a.direction = 1))
			.freeze()
	);

	// frame-based
	sequences.set(
		"rotateHead",
		new Sequence()
			.step((a) => {
				a.headOnly = true;
				a.gesture = "srp";
				a.direction = 2;
			})
			.step((a) => (a.direction = 3))
			.step((a) => (a.direction = 4))
			.step((a) => (a.direction = 5))
			.step((a) => (a.direction = 6))
			.step((a) => (a.direction = 7))
			.step((a) => (a.direction = 0))
			.step((a) => (a.direction = 1))
			.step((a) => {
				a.gesture = "sml";
				a.direction = 2;
			})
			.step((a) => (a.direction = 3))
			.step((a) => (a.direction = 4))
			.step((a) => (a.direction = 5))
			.step((a) => (a.direction = 6))
			.step((a) => (a.direction = 7))
			.step((a) => (a.direction = 0))
			.step((a) => (a.direction = 1))
			.freeze()
	);

	// frame-based
	sequences.set(
		"rotateSit",
		new Sequence()
			.step((a) => {
				a.sit = Infinity;
				a.gesture = "srp";
				a.direction = [2, 2];
			})
			.step((a) => (a.direction = [3, 2]))
			.step((a) => (a.direction = [3, 4]))
			.step((a) => (a.direction = [4, 4]))
			.step((a) => (a.direction = [5, 4]))
			.step((a) => (a.direction = [5, 6]))
			.step((a) => (a.direction = [6, 6]))
			.step((a) => (a.direction = [7, 6]))
			.step((a) => (a.direction = [7, 0]))
			.step((a) => (a.direction = [0, 0]))
			.step((a) => (a.direction = [1, 0]))
			.step((a) => (a.direction = [1, 2]))
			.freeze()
	);

	// frame-based
	sequences.set(
		"rotateLay",
		new Sequence()
			.step((a) => (a.lay = Infinity))
			.step((a) => (a.direction = 2))
			.step((a) => (a.direction = 6))
			.freeze()
	);

	sequences.set(
		"artist",
		new Sequence()
			.step((a) => {
				a.walk = 3;
				a.handItem = 142;
				a.carry = 3;
				a.signItem = 11;
				a.sign = 3;
				a.direction = 4;
			})
			.delay(2)
			.freeze()
	);

	sequences.set(
		"test1",
		new Sequence()
			.step((a) => {
				a.handItem = 1;
				a.carry = 2;
			})
			.delay(3)
			.step((a) => (a.drink = 2))
			.delay(3)
			.step((a) => {
				a.handItem = 2;
				a.carry = 2;
			})
			.delay(2)
			.step((a) => (a.drink = 1))
			.delay(1)
			.step((a) => (a.carry = 5))
			.delay(7)
			.freeze()
	);

	sequences.set(
		"test2",
		new Sequence()
			.step((a) => {
				a.sit = 1;
				a.wave = Infinity;
			})
			.delay(2)
			.freeze()
	);

	return sequences;
}

/**
 * @param {string} hotel
 * @param {string} nickname
 * @param {string} figure
 * @param {string} sequenceName
 * @param {HTMLElement} [container]
 * @param {AnimationController} [animController]
 */
function addCreation(
	hotel,
	nickname,
	figure,
	sequenceName,
	container = document.querySelector("#creations .list"),
	animController
) {
	if (!(container instanceof HTMLElement))
		throw new Error(
			"Container is not an HTML element. It needs to be supplied or have a '#creations .list' element on the page."
		);

	const elem = document.createElement("div");
	elem.classList.add("animated-avatar");

	if (nickname && !hotel)
		throw new Error("Hotel is required if nickname is supplied.");

	if (hotel) elem.setAttribute("data-hotel", hotel);

	if (nickname) elem.setAttribute("data-nickname", nickname);
	else if (figure) elem.setAttribute("data-figure", figure);
	else throw new Error("Nickname or figure string needs to be supplied.");

	if (
		!sequenceName ||
		(sequenceName !== "live editing" && !sequences.has(sequenceName))
	)
		throw new Error("Invalid sequence name: " + sequenceName);
	elem.setAttribute("data-sequence", sequenceName);

	container.appendChild(elem);

	if (animController instanceof AnimationController) {
		const avatar = new Avatar(elem);
		const sequence =
			sequenceName === "live editing"
				? computeLiveSequence()
				: sequences.get(sequenceName);
		const animation = avatar.createAnimation(sequence);
		animController.addAnimation(animation);

		return { elem, avatar, sequence, animation };
	}

	return elem;
}

const animController = new AnimationController(6);

const container = document.querySelector("#creations .list");
addCreation("com.br", "alynva", null, "default", container, animController);
addCreation("com.br", ",Liah...", null, "default", container, animController);
addCreation(
	"com.br",
	null,
	"hr-893-61.hd-180-1.ch-215-96.lg-280-93.sh-290-101.ha-1013-1423.wa-2003",
	"rotateHead",
	container,
	animController
);
addCreation("com.br", "GuReiPanda", null, "artist", container, animController);

animController.play();

/** @param {Map<string, SequenceFreezedArray>} sequences */
function updateSequenceSelector(sequences) {
	const select = document.querySelector(
		"#creator .preview select[name=sequence]"
	);

	if (!select) return;

	select.innerHTML = "";

	// <optgroup label="original"></optgroup>
	const liveGrp = document.createElement("optgroup");
	select.appendChild(liveGrp);
	const liveOption = document.createElement("option");
	liveOption.innerText = "live editing";
	liveGrp.appendChild(liveOption);

	for (const entry of sequences) {
		const option = document.createElement("option");
		option.innerText = entry[0];
		select.appendChild(option);
	}
}

updateSequenceSelector(sequences);

function setupAnimationControls() {
	fixPreviewEventHandlers();
	// TODO: save btn
}
setupAnimationControls();

function fixPreviewEventHandlers() {
	const form = document.getElementById("form-preview");
	const elemts = Array.from(form.querySelectorAll("select, input"));

	for (const elem of elemts) {
		elem.removeEventListener("change", updateAnimationPreview);
		elem.addEventListener("change", updateAnimationPreview);
		elem.removeEventListener("keyup", updateAnimationPreview);
		elem.addEventListener("keyup", updateAnimationPreview);
		console.log(elem);
	}
}
function updateAnimationPreview() {
	const form = document.getElementById("form-preview");
	const data = new FormData(form);

	let sequenceName = data.get("sequence");
	if (sequenceName !== "live editing" && !sequences.has(sequenceName)) {
		updateSequenceSelector(sequences);
		sequenceName = sequences[0];
	}

	let avatarMode = data.get("avatar");
	if (!["live avatar", "figure"].includes(avatarMode)) {
		avatarMode = "live avatar";
	}

	let hotel = data.get("hotel");
	let nickname = data.get("nickname");
	let figure = data.get("figure");
	const avatarFieldsContainer = form.querySelector(".avatar-field");
	if (avatarMode === "live avatar") {
		if (!hotel || !nickname) {
			avatarFieldsContainer.innerHTML = `
				<input type="text" name="hotel" placeholder="Hotel" value="com.br" list="hotels">
				<input type="text" name="nickname" placeholder="Nickname" value="alynva">
			`;
			fixPreviewEventHandlers();
			hotel = "com.br";
			nickname = "alynva";
			figure = null;
		}
	} else if (avatarMode === "figure") {
		if (!figure) {
			avatarFieldsContainer.innerHTML = `
				<input type="text" name="figure" placeholder="Figure" value="hr-802-40.hd-180-1.ch-3030-1408.lg-3023-64.sh-4159-64-1408.ha-3843-1408-64.ea-3484.cc-4184-64-1408.cp-3284-64">
			`;
			fixPreviewEventHandlers();
			hotel = null;
			nickname = null;
			figure =
				"hr-802-40.hd-180-1.ch-3030-1408.lg-3023-64.sh-4159-64-1408.ha-3843-1408-64.ea-3484.cc-4184-64-1408.cp-3284-64";
		}
	}

	const previewContainer = document.querySelector(
		"#creator .preview .avatar"
	);
	previewContainer.innerHTML = "";
	addCreation(
		hotel,
		nickname,
		figure,
		sequenceName,
		previewContainer,
		animController
	);
	animController.clearUnloadedAvatars();
}
updateAnimationPreview();

function setupSequenceControls() {
	const btns = Array.from(
		document.querySelectorAll("#creator .sequence .controls button")
	);
	const handlers = {
		"add-change": null,
		"add-step": addStep,
		"add-delay": addDelay,
		reset: reset,
	};

	for (const btn of btns) {
		const handler = handlers[btn.getAttribute("data-handler")];
		if (!handler) continue;
		btn.removeEventListener("click", handler);
		btn.addEventListener("click", handler);
	}
}
setupSequenceControls();

function addStep() {
	const container = document.querySelector("#creator .sequence .step-list");

	const hr = document.createElement("hr");
	container.appendChild(hr);

	const elem = document.createElement("div");
	elem.classList.add("step");
	container.appendChild(elem);

	const changes = document.createElement("div");
	changes.classList.add("changes");
	elem.appendChild(changes);

	const controls = document.createElement("div");
	controls.classList.add("controls");
	elem.appendChild(controls);

	const addChangeBtn = document.createElement("button");
	addChangeBtn.type = "button";
	addChangeBtn.setAttribute("data-handler", "add-change");
	addChangeBtn.addEventListener("click", addChange.bind(null, changes));
	addChangeBtn.innerText = "add change";
	controls.appendChild(addChangeBtn);

	addChange(changes);
}

const CHANGES_TYPES = {
	NOTHING: "nothing",
	DURATION: "duration",
	HAND_ITEM: "hand-item",
	SIGN_ITEM: "sign-item",
	DIRECTION: "direction",
	GESTURE: "gesture",
	BOOLEAN: "boolean",
};
const VALID_CHANGES = {
	reset: CHANGES_TYPES.NOTHING,
	walk: CHANGES_TYPES.DURATION,
	wave: CHANGES_TYPES.DURATION,
	sit: CHANGES_TYPES.DURATION,
	lay: CHANGES_TYPES.DURATION,
	"hand item": CHANGES_TYPES.HAND_ITEM,
	carry: CHANGES_TYPES.DURATION,
	drink: CHANGES_TYPES.DURATION,
	"sign item": CHANGES_TYPES.SIGN_ITEM,
	sign: CHANGES_TYPES.DURATION,
	direction: CHANGES_TYPES.DIRECTION,
	gesture: CHANGES_TYPES.GESTURE,
	"head only": CHANGES_TYPES.BOOLEAN,
};

/** @param {HTMLElement} container */
function addChange(container) {
	const change = document.createElement("div");
	change.classList.add("change");
	container.appendChild(change);

	const changeTypeSelect = document.createElement("select");
	changeTypeSelect.classList.add("change-type");
	changeTypeSelect.name = "changeType";
	changeTypeSelect.addEventListener("change", () =>
		updateStepChangeValueField(changeTypeSelect)
	);
	change.appendChild(changeTypeSelect);

	for (const change in VALID_CHANGES) {
		const option = document.createElement("option");
		option.innerText = change;
		option.setAttribute("data-type", VALID_CHANGES[change]);
		if (change === "walk") option.selected = true;
		changeTypeSelect.appendChild(option);
	}

	const changeValueField = document.createElement("input");
	changeValueField.name = "changeValue";
	changeValueField.value = 8;
	changeValueField.addEventListener("change", () => updateAnimationPreview());
	change.appendChild(changeValueField);

	updateStepChangeValueField(changeTypeSelect);
}

/** @param {HTMLSelectElement} typeSelect */
function updateStepChangeValueField(typeSelect) {
	const typeSelected = typeSelect.selectedOptions[0];
	const field = typeSelect.nextElementSibling;

	if (!typeSelected || !field) return;

	field.removeAttribute("style");
	field.removeAttribute("type");
	field.removeAttribute("list");

	switch (typeSelected.getAttribute("data-type")) {
		case CHANGES_TYPES.NOTHING:
			field.style.display = "none";
			break;
		case CHANGES_TYPES.DURATION:
			field.type = "number";
			field.placeholder = "Duration";
			break;
		case CHANGES_TYPES.HAND_ITEM:
			field.type = "number";
			field.placeholder = "Hand item ID";
			field.list = "hand-itens";
			break;
		case CHANGES_TYPES.SIGN_ITEM:
			field.type = "number";
			field.placeholder = "Sign item ID";
			field.list = "sign-itens";
			break;
		case CHANGES_TYPES.DIRECTION:
			field.type = "number";
			field.placeholder = "Direction";
			field.list = "directions";
			break;
		case CHANGES_TYPES.GESTURE:
			field.type = "text";
			field.placeholder = "Gesture";
			field.list = "gestures";
			break;
		case CHANGES_TYPES.BOOLEAN:
			field.type = "text";
			field.placeholder = "Boolean";
			field.list = "booleans";
			break;
	}

	updateAnimationPreview();
}

function addDelay() {
	const container = document.querySelector("#creator .sequence .step-list");

	const hr = document.createElement("hr");
	container.appendChild(hr);

	const elem = document.createElement("div");
	elem.classList.add("step", "delay");
	container.appendChild(elem);

	const field = document.createElement("input");
	field.type = "number";
	field.name = "delay";
	field.placeholder = "Duration";
	field.value = 8;
	elem.appendChild(field);

	updateAnimationPreview();
}

function reset() {
	const container = document.querySelector("#creator .sequence .step-list");

	container.innerHTML = "";
	addStep();
	addDelay();
}
reset();

function computeLiveSequence() {
	const steps = Array.from(
		document.querySelectorAll("#creator .sequence .step-list .step")
	);

	const sequence = new Sequence();
	for (const step of steps) {
		if (step.classList.contains("delay")) {
			const delay = step.querySelector("[name=delay]")?.value;
			if (!delay) continue;
			sequence.delay(+delay);
		} else {
			const changes = Array.from(
				step.querySelectorAll(".changes .change")
			);
			const changesComputed = [];

			for (const change of changes) {
				const changeType =
					change.querySelector("[name=changeType]")?.value;
				const changeValueField =
					change.querySelector("[name=changeValue]");
				if (!changeType || !changeValueField) continue;

				const changeValue =
					changeValueField.getAttribute("type") === "number"
						? +changeValueField.value
						: changeValueField.value;

				changesComputed.push({ type: changeType, value: changeValue });
			}

			sequence.step(createStepHandler(changesComputed));
		}
	}

	return sequence.freeze();
}

function createStepHandler(changes) {
	const methodMap = {
		"hand item": "handItem",
		"sign item": "signItem",
		"head only": "headOnly",
	};
	return (a) => {
		for (const change of changes) {
			try {
				if (methodMap[change.type])
					a[methodMap[change.type]] = change.value;
				else a[change.type] = change.value;
			} catch (err) {
				try {
				} catch (err) {
					console.error(err);
				}
			}
		}
	};
}
