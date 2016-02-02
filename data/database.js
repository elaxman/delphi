// Model types
export class Message extends Object {};
export class User extends Object {};

// Mock user data
var viewer = new User();
viewer.name = 'Default';

// Mock messages data
var nextMessageId = 0;
var messages = {};

addMessage('Hello World');
addMessage('Write your message below');

export function addMessage(text) {
  var message = new Message();
  message.text = text;
  message.id = `${nextMessageId++}`;
  messages[message.id] = message;
  return message.id;
}

export function getMessage(id) {
  return messages[id];
}

export function getMessages() {
  return Object.keys(messages).map((key) => messages[key]);;
}

export function removeMessage(id) {
  delete messages[id];
}

export function getViewer() {
  return viewer;
}
