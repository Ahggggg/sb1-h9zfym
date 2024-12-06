export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number;

  constructor(maxTokens: number, refillIntervalMs: number) {
    this.maxTokens = maxTokens;
    this.refillRate = refillIntervalMs;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  private refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const refillAmount = Math.floor(timePassed / this.refillRate);
    
    if (refillAmount > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + refillAmount);
      this.lastRefill = now;
    }
  }

  async waitForToken(): Promise<void> {
    this.refill();
    
    if (this.tokens > 0) {
      this.tokens--;
      return Promise.resolve();
    }

    const waitTime = this.refillRate - (Date.now() - this.lastRefill);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return this.waitForToken();
  }
}