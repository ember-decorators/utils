import { computed as emberComputed } from '@ember/object';

import { SUPPORTS_NEW_COMPUTED } from 'ember-compatibility-helpers';

export function computed(desc) {
  if (SUPPORTS_NEW_COMPUTED || typeof desc === 'function') {
    return emberComputed(desc);
  } else {
    const { get, set } = desc;

    return emberComputed(function (key, value) {
      if (arguments.length > 1) {
        return set.call(this, key, value);
      }

      return get.call(this);
    });
  }
}
