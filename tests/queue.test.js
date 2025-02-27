import { EventQueue } from '../src/queue.js';

describe('EventQueue', () => {
  let queue;

  beforeEach(() => {
    queue = new EventQueue();
  });

  test('push adds an event', () => {
    queue.push({ type: 'test' });
    expect(queue.queue.length).toBe(1);
  });

  test('shift removes and returns first event', () => {
    queue.push({ type: 'test' });
    const event = queue.shift();
    expect(event.type).toBe('test');
    expect(queue.isEmpty()).toBe(true);
  });

  test('retry re-queues event up to maxRetries', () => {
    const event = { type: 'test', retries: 0 };
    queue.retry(event);
    expect(queue.queue.length).toBe(1);
    event.retries = 3;
    queue.retry(event);
    expect(queue.queue.length).toBe(1); // No re-queue beyond maxRetries
  });
});