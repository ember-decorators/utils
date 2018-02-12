import { DEBUG } from '@glimmer/env';
import { HAS_NATIVE_COMPUTED_GETTERS, HAS_DESCRIPTOR_TRAP } from 'ember-compatibility-helpers';

import { assert } from '@ember/debug';

const DESCRIPTOR = '__DESCRIPTOR__';

export function isDescriptorTrap(possibleDesc) {
  if (HAS_DESCRIPTOR_TRAP && DEBUG) {
    return possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc[DESCRIPTOR] !== undefined;
  } else {
    throw new Error('Cannot call `isDescriptorTrap` in production');
  }
}

export function isComputedDescriptor(possibleDesc) {
  return possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor;
}

export function computedDescriptorFor(obj, keyName) {
  assert('Cannot call `descriptorFor` on null', obj !== null);
  assert('Cannot call `descriptorFor` on undefined', obj !== undefined);
  assert(`Cannot call \`descriptorFor\` on ${typeof obj}`, typeof obj === 'object' || typeof obj === 'function');

  if (HAS_NATIVE_COMPUTED_GETTERS) {
    let meta = Ember.meta(obj);

    if (meta !== undefined) {
      return meta.peekDescriptors(keyName);
    }
  } else if (Object.hasOwnProperty.call(obj, keyName)) {
    let { value: possibleDesc } = Object.getOwnPropertyDescriptor(obj, keyName);

    if (DEBUG && HAS_DESCRIPTOR_TRAP && isDescriptorTrap(possibleDesc)) {
      return possibleDesc[DESCRIPTOR];
    }

    return isComputedDescriptor(possibleDesc) ? possibleDesc : undefined;
  }
}
