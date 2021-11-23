const GLOBAL_MEMOIZATION_MAP = new WeakMap<object, Map<string, unknown>>();

// tslint:disable-next-line:ban-types
export function Memoized<T extends { constructor: Function }>(
    target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor,
): PropertyDescriptor {
    const originalGet = descriptor.get; // tslint:disable-line: no-unbound-method

    if (!originalGet) {
        throw new Error(`Cannot apply @Memoize decorator to '${target.constructor.name}.${propertyKey}' since it has no get accessor`);
    }

    return {
        ...descriptor,
        get(this: object): unknown {
            let localMemoizationMap = GLOBAL_MEMOIZATION_MAP.get(this);
            if (!localMemoizationMap) {
                localMemoizationMap = new Map<string, unknown>();
                GLOBAL_MEMOIZATION_MAP.set(this, localMemoizationMap);
            }

            if (localMemoizationMap.has(propertyKey)) {
                return localMemoizationMap.get(propertyKey);
            }

            const value = originalGet.call(this);

            localMemoizationMap.set(propertyKey, value);

            return value;
        },
    };
}
