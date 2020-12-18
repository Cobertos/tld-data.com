export const mobileBreakPoint = 768; //px

/**Assertion helper, custom message and error type
 */
export function _assert(condition, message = "Assertion Error", error = Error) {
  if (!condition) {
    throw new error(message);
  }
}