export class EventQueue {
  constructor() {
    this.queue = [];
    this.maxRetries = 3;
  }

  push(event) {
    this.queue.push({ ...event, retries: 0 });
  }

  shift() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  retry(event) {
    if (event.retries < this.maxRetries) {
      event.retries++;
      this.queue.push(event);
    }
  }
}