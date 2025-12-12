"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(config = { maxMessages: 12, windowSeconds: 6 }) {
        this.messageCount = 0;
        this.config = config;
        this.windowStart = Date.now();
    }
    checkLimit() {
        const now = Date.now();
        const timeElapsed = (now - this.windowStart) / 1000;
        // If window has passed, reset the counter and start new window
        if (timeElapsed >= this.config.windowSeconds) {
            this.messageCount = 1; // Count the current message as first in new window
            this.windowStart = now;
            console.log(`1 Messages in 0.00 seconds`);
            return {
                allowed: true,
                stats: {
                    messagesInWindow: 1,
                    timeElapsed: 0
                }
            };
        }
        // Increment message count for current window
        this.messageCount++;
        // Check if limit exceeded (should be > not >=)
        const allowed = this.messageCount <= this.config.maxMessages;
        console.log(`${this.messageCount} Messages in ${timeElapsed.toFixed(2)} seconds${!allowed ? ' - RATE LIMIT EXCEEDED' : ''}`);
        return {
            allowed,
            stats: {
                messagesInWindow: this.messageCount,
                timeElapsed: parseFloat(timeElapsed.toFixed(2))
            }
        };
    }
    reset() {
        this.messageCount = 0;
        this.windowStart = Date.now();
    }
    getStats() {
        const now = Date.now();
        const timeElapsed = (now - this.windowStart) / 1000;
        return {
            messagesInWindow: this.messageCount,
            timeElapsed: parseFloat(timeElapsed.toFixed(2)),
            maxMessages: this.config.maxMessages,
            windowSeconds: this.config.windowSeconds,
            remaining: Math.max(0, this.config.maxMessages - this.messageCount)
        };
    }
}
exports.RateLimiter = RateLimiter;
