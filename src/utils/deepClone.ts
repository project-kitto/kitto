export function deepClone<T>(value: T): T {
    if (value instanceof Set) return Array.from(value) as any;
    if (Array.isArray(value)) return value.map(deepClone) as any;
    if (value && typeof value === 'object') {
        const result: any = {};
        for (const key in value) {
            result[key] = deepClone(value[key]);
        }
        return result;
    }
    return value;
}
