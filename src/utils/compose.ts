export const compose = function(...functions: any) {
    return (input?: any) => functions.reduceRight((chain: any, func: Function) =>
        chain.then(func), Promise.resolve(input))
};
