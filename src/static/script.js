/** @type {{ [name: string]: SequenceFreezedArray }} */
const sequences = {
	// time-based
	default: new Sequence()
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
		.freeze(),

	// frame-based
	rotate: new Sequence()
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
		.freeze(),

	// frame-based
	rotateHead: new Sequence()
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
		.freeze(),

	// frame-based
	rotateSit: new Sequence()
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
		.freeze(),

	// frame-based
	rotateLay: new Sequence()
		.step((a) => (a.lay = Infinity))
		.step((a) => (a.direction = 2))
		.step((a) => (a.direction = 6))
		.freeze(),

	artist: new Sequence()
		.step((a) => {
			a.walk = 3;
			a.handItem = 142;
			a.carry = 3;
			a.signItem = 11;
			a.sign = 3;
			a.direction = 4;
		})
		.delay(2)
		.freeze(),

	test1: new Sequence()
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
		.freeze(),
	test2: new Sequence()
		.step((a) => {
			a.sit = 1;
			a.wave = Infinity;
		})
		.delay(2)
		.freeze(),
};

const animatedAvatars = Array.from(
	document.querySelectorAll(".animated-avatar")
);

const animController = new AnimationController(6);

for (const animatedAvatar of animatedAvatars) {
	const avatar = new Avatar(animatedAvatar);
	const sequence = sequences[animatedAvatar.getAttribute("data-sequence")];
	const animation = new AvatarAnimation(avatar, sequence, true);
	animController.addAnimation(animation);

	animatedAvatar.addEventListener("click", () => {
		if (animation.isPlaying) animation.pause(false);
		else animation.play();
	});
	animatedAvatar.addEventListener("dblclick", () => {
		animation.stop();
	});
}

animController.play();

// document.body.addEventListener("click", () => {
// 	if (animController.isPlaying) animController.pause()
// 	else animController.play()
// })
// document.body.addEventListener("dblclick", () => {
// 	animController.stop()
// })
