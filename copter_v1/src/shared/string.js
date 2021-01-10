
/**
 * @func alphaOnly - Get alphanumeric characters from a String
 * @param {String} str
 * @returns {String}
 * @example
 * const myString = 'abc123!@#$%^'
 * alphaOnly(myString) // => 'abc123'
 */
export const alphaOnly = str =>
    str.match(/([a-zA-Z0-9]|\s)/gi).join('')


export const lettersOnly = str =>
    str.match(/([a-zA-Z]|\s)/gi).join('')


export const numbersOnly = str =>
    str.match(/([0-9]|\s)/gi).join('')


/**
 * @func kebabCase
 * @param {String} str
 * @returns {String}
 * @example
 * kebabCase(`hello world`) //=> hello-world
 * kebabCase('hiThere') // => hi-there
 */
export const kebabCase = str =>
    str.match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g)
        .filter(Boolean)
        .map(x => x.toLowerCase())
        .join('-')


/**
 * @func camelCase
 * @param {String} str
 * @returns {String}
 * @example
 * camelCase('Hello-world') // => 'HelloWorld'
 */
export const camelCase = str =>
    str.toLowerCase()
        .replace( /[-_]+/g, ' ')
        .replace( / (.)/g, sub => sub.toUpperCase())
        .split(' ')
        .join('')


/**
 * @func titleCase
 * @param {String} str
 * @returns {String}
 * @example
 * titleCase(`mY shIfT KeY IS BroKEn`) //=> 'My Shift Key Is Broken'
 */
export const titleCase = str =>
    str.replace(/\w\S*/g, txt =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
