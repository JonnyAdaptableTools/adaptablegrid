var Debug = function (state) {

    /**
     * Debug.__constructor
     * Initialise the debug object
     * @param {boolean} state - Whether to turn on/off debug reporting
     * @returns {void}
     */
    this.__constructor = function (state) {
        this.longtime = 100;
        this.timers = {};
        if (state) {
            this.on();
        }
        else {
            this.off();
        }
    }

    /**
     * Debug.on
     * Turn on debug reporting
     * @returns {void}
     */
    this.on = function () {
        this.reporting = true;
        console.log("Debugging on...");
    }

    /**
     * Debug.off
     * Turn off debug reporting
     * @returns {void}
     */
    this.off = function () {
        this.reporting = false;
        console.log("Debugging off...");
    }

    /**
     * Debug.start
     * Starts another debug timer
     * @param {string} name - The timer name
     * @returns {void}
     */
    this.start = function (name) {
        this.timers[name] = performance.now();
    }

    /**
     * Debug.end
     * Ends the timer with the name given
     * @param {string} name - The timer name
     * @returns {void}
     */
    this.end = function (name) {
        endTime = performance.now();
        difference = endTime - this.timers[name];
        this.timers[name] = difference;
        this.report(name);
    }

    /**
     * Debug.report
     * Outputs the time taken for the timer given
     * Shows a warning if over the 'long timer' threshold
     * @param {string} name - The timer name
     * @returns {void}
     */
    this.report = function (name) {
        if (this.reporting && console) {
            if (this.timers[name] > this.longtime) {
                console.warn(name + ": " + this.timers[name].toPrecision(4) + "ms");
            }
            else {
                console.info(name + ": " + this.timers[name].toPrecision(4) + "ms");
            }
        }
    }

    return this.__constructor(state);

}