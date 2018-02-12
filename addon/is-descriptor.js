export default function isDescriptor(item) {
  return typeof item === 'object'
    && item !== null
    && 'enumerable' in item
    && 'configurable' in item;
}
