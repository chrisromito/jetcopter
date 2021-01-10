/**
 * Emitter utils
 */

/**
 * @func mapEvents - {eventName: [listenerA, listenerB]}
 * @param {{ String: (function(*):*[]) }} eventMap
 * @returns {function(EventEmitter): *}
 */
export const mapEvents = eventMap => target =>
    Object.entries(eventMap)
        .forEach(([event, listeners]) =>
            target.on(event, (...args) =>
                listeners.forEach(fn => fn(...args))
            )
        )
