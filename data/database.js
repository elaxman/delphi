import moment from 'moment';

// Model types
export class Datacenter extends Object {};
export class Cloud extends Object {};

// Mock user data
var cloud = new Cloud();
cloud.name = 'Default';

// Mock datacenters data
var nextDatacenterId = 0;
var datacenters = {};

addDatacenter('Hello World', moment().toISOString());
addDatacenter('Write your datacenter/TODO below', moment().toISOString());

export function addDatacenter(text, timestamp) {
  var datacenter = new Datacenter();
  datacenter.id = `${nextDatacenterId++}`;
  datacenter.text = text;
  datacenter.timestamp = timestamp;
  datacenters[datacenter.id] = datacenter;
  return datacenter.id;
}

export function getDatacenter(id) {
  return datacenters[id];
}

export function getDatacenters() {
  return Object.keys(datacenters).map((key) => datacenters[key]);
}

export function removeDatacenter(id) {
  delete datacenters[id];
}

export function getCloud() {
  return cloud;
}
