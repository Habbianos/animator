/**
 * @typedef SequenceStepModifier
 * @type {(avatar: Avatar) => any}
 */

/**
 * @typedef SequenceStepDelay
 * @type {number}
 */

/**
 * @typedef SequenceStep
 * @type {SequenceStepModifier | SequenceStepDelay}
 */

/**
 * @typedef SequenceArray
 * @type {SequenceStep[]}
 */

/**
 * @typedef SequenceFreezedArray
 * @type {Readonly<SequenceArray>}
 */

/**
 * @typedef HotelId
 * @type {'com' | 'com.br' | 'com.es'}
 */

/**
 * @typedef Direction
 * @type {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}
 */

/**
 * @typedef Gesture
 * @type {'none' | 'sml' | 'srp' | 'sad' | 'agr'}
 */

/**
 * @typedef Action
 * @type {'std' | 'wlk' | 'wav' | 'sit' | 'lay'}
 */