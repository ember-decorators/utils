import EmberObject from '@ember/object';
import { module, test } from 'qunit';

import { validationsFor, validationsForKey } from '@ember-decorators/utils/debug';

module('validation meta');

test('validations correctly link to parent validations', function(assert) {
  class Foo extends EmberObject {}
  class Bar extends Foo {}

  validationsFor(Foo.prototype).test = true;

  assert.equal(validationsFor(Bar.prototype).test, true, 'validations are properly linked');
});

test('validations for child get extend validations for parent', function(assert) {
  class Foo extends EmberObject {}
  class Bar extends Foo {}

  validationsForKey(Foo.prototype, 'test').isAttribute = true;

  validationsForKey(Bar.prototype, 'test').isImmutable = true;
  validationsForKey(Bar.prototype, 'test').typeValidators.push('test');

  assert.equal(validationsFor(Foo.prototype).typeValidators.length, 0, 'parent validations are not affected by child');
  assert.equal(validationsFor(Foo.prototype).isImmutable, false, 'parent validations are not affected by child');

  assert.equal(validationsFor(Bar.prototype).isAttribute, true, 'child validations inherit from parent');
});
