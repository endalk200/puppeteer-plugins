// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction<T extends Function = Function>(value: unknown): value is T {
    return typeof value === "function";
}

export function runIfFn<T, U>(valueOrFn: T | ((...fnArgs: U[]) => T), ...args: U[]): T {
    return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}
