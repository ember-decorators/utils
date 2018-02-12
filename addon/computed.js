import { decoratorWithParams, decoratorWithRequiredParams } from './decorator';
import { computedDescriptorFor, isComputedDescriptor } from './-private';
import { HAS_NATIVE_COMPUTED_GETTERS } from 'ember-compatibility-helpers';

import { assert } from '@ember/debug';

/**
 * A macro that receives a decorator function which returns a ComputedProperty,
 * and defines that property using `Ember.defineProperty`. Conceptually, CPs
 * are custom property descriptors that require Ember's intervention to apply
 * correctly. In the future, we will use finishers to define the CPs rather than
 * directly defining them in the decorator function.
 *
 * @param {Function} fn - decorator function
 */
export function computedDecorator(fn) {
  return function(target, key, desc, params) {
    let previousDesc = computedDescriptorFor(target, key) || desc;
    let computedDesc = fn(target, key, previousDesc, params);

    assert(`computed decorators must return an instance of an Ember ComputedProperty descriptor, received ${computedDesc}`, isComputedDescriptor(computedDesc));

    if (HAS_NATIVE_COMPUTED_GETTERS) {
      Ember.defineProperty(target, key, computedDesc);
    } else {
      Object.defineProperty(target, key, { value: computedDesc });
    }

    // There's currently no way to disable redefining the property when decorators
    // are run, so return the property descriptor we just assigned
    return Object.getOwnPropertyDescriptor(target, key);
  }
}

export function computedDecoratorWithParams(fn) {
  return decoratorWithParams(computedDecorator(fn));
}

export function computedDecoratorWithRequiredParams(fn) {
  return decoratorWithRequiredParams(computedDecorator(fn));
}
