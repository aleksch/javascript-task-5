'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * @param {Object} events
 * @param {String} eventName
 */
function callEvent(events, eventName) {
    if (eventName in events) {
        for (let event of events[eventName]) {
            event.handler.call(event.context);
        }
    }
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    let events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} Emmiter
         */
        on: function (event, context, handler) {
            if (!(event in events)) {
                events[event] = [];
            }

            events[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} Emmiter
         */
        off: function (event, context) {
            let eventsNames = Object.keys(events)
                .filter((e) => e === event || e.startsWith(event + '.'));

            for (let eventName of eventsNames) {
                events[eventName] = events[eventName].
                    filter(curEvent => curEvent.context !== context);
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} Emmiter
         */
        emit: function (event) {

            let eventNames = [];
            let namespaceParts = event.split('.');
            while (namespaceParts.length > 0) {
                eventNames.push(namespaceParts.join('.'));
                namespaceParts.pop();
            }

            for (let eventName of eventNames) {
                callEvent(events, eventName);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} Emmiter
         */
        several: function (event, context, handler, times) {
            let count = 0;
            this.on(event, context, function () {
                if (count < times) {
                    handler.call(context);
                }
                count++;
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} Emmiter
         */
        through: function (event, context, handler, frequency) {
            let count = 0;
            this.on(event, context, function () {
                if (count % frequency === 0) {
                    handler.call(context);
                }
                count++;
            });

            return this;
        }
    };
}
