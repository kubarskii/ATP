export const compose = function (...functions: any) {
  return (input?: any) =>
    functions.reduceRight((chain: any, $function: () => any) => chain.then($function), Promise.resolve(input));
};
