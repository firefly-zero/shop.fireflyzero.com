import { ApiError } from "./api";

/**
 * Extract user-friendly error text from an error.
 *
 * The error might be a raised exception, a preact-query error value,
 * or an error API response.
 */
export function formatError(e: Error | ApiError | string): string {
  if (!e) {
    return "unknown error";
  }
  if (typeof e === "string") {
    return e;
  }
  const isObject = typeof e === "object" && !Array.isArray(e) && e !== null;
  if (!isObject) {
    return `${e}`;
  }

  if ("message" in e && typeof e.message === "string") {
    if ("name" in e && typeof e.name === "string" && e.name && e.name !== "Error") {
      if (e.message) {
        return `${e.name}: ${e.message}`;
      } else {
        return e.name;
      }
    }
    if (e.message) {
      if (typeof e.message === "string") {
        return e.message;
      } else {
        JSON.stringify(e.message);
      }
    }
  }

  if ("errors" in e) {
    return formatApiError(e);
  }
  return JSON.stringify(e);
}

/**
 * Extract user-friendly error text from an error API response.
 */
function formatApiError(errors: ApiError): string {
  if (!errors.errors) {
    return `${errors}`;
  }
  const error = errors.errors[0];
  if (!error) {
    return `${errors}`;
  }
  return error.detail;
}
