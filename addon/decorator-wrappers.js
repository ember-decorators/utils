import Ember from 'ember';
import isDescriptor from './is-descriptor';
import normalizeDescriptor from './normalize-descriptor';

function handleDescriptor(target, key, desc, fn, params = []) {
  normalizeDescriptor(desc);

  Ember.defineProperty(target, fn(target, key, desc, params));
}

export function decorator(fn) {
  return function(...params) {
    return handleDescriptor(...arguments, fn, params);
  };
}

export function decoratorWithParams(fn) {
  return function(...params) {
    // determine if user called as @computed('blah', 'blah') or @computed
    if (isDescriptor(params[params.length - 1])) {
      return handleDescriptor(...arguments, fn);
    } else {
      return function(/* target, key, desc */) {
        return handleDescriptor(...arguments, fn, params);
      };
    }
  };
}
