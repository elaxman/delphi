import moment from 'moment';

// Model types
export class Message extends Object {};
export class User extends Object {};

// Mock user data
var viewer = new User();
viewer.name = 'Default';

// Mock messages data
var nextMessageId = 0;
var messages = {};

addMessage('Hello World', moment().toISOString());
addMessage('Write your message below', moment().toISOString());

export function addMessage(text, timestamp) {
  var message = new Message();
  message.id = `${nextMessageId++}`;
  message.text = text;
  message.timestamp = timestamp;
  messages[message.id] = message;
  return message.id;
}

export function getMessage(id) {
  return messages[id];
}

export function getMessages() {
  return Object.keys(messages).map((key) => messages[key]);
}

export function removeMessage(id) {
  delete messages[id];
}

export function getViewer() {
  return viewer;
}
