module.exports = {
  WebSocket: class MockWebSocket {
    constructor() {
      this.readyState = 1;
    }
    send = jest.fn();
    close = jest.fn();
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
  }
};