const validationMetaMap = new WeakMap();

class FieldValidations {
  constructor(parentValidations = null) {
    if (parentValidations === null) {
      this.isRequired = false;
      this.isImmutable = false;
      this.isArgument = false;
      this.typeRequired = false;

      this.typeValidators = [];
    } else {
      const {
        isRequired,
        isImmutable,
        isArgument,
        typeRequired,
        typeValidators
      } = parentValidations;

      this.isRequired = isRequired;
      this.isImmutable = isImmutable;
      this.isArgument = isArgument;
      this.typeRequired = typeRequired;

      this.typeValidators = typeValidators.slice();
    }
  }
}

export function validationsFor(target) {
  if (!validationMetaMap.has(target)) {
    const parentMeta = validationMetaMap.get(Object.getPrototypeOf(target));
    validationMetaMap.set(target, Object.create(parentMeta || Object));
  }

  return validationMetaMap.get(target);
}

export function validationsForKey(target, key) {
  const validations = validationsFor(target);

  if (!validations.hasOwnProperty(key)) {
    const parentValidations = validations[key];
    validations[key] = new FieldValidations(parentValidations);
  }

  return validations[key];
}
