export interface Operation {
    createResponse: (p: any) => any | void, //should return Tuple
    getCommandName: () => string,
}

export interface GeneratePayload {
    generatePayload: () => any,
}