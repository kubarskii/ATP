export type CallMessage = [2, string, string, { [key: string]: any }];
export type CallResultMessage = [3, string, { [key: string]: any }];
export type ErrorMessage = [4, string, string, string, { [key: string]: any }];

// TODO update validator to match oneOf types above ↑

export function validateParsedMessage(message: CallMessage | CallResultMessage | ErrorMessage): boolean {
  return Array.isArray(message);
}
