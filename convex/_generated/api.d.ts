/* eslint-disable */
/**
 * Generated API.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@0.6.0.
 * To regenerate, run `npx convex codegen`.
 * @module
 */

import type { ApiFromModules } from "convex/api";
import type * as createRoom from "../createRoom";
import type * as deleteRow from "../deleteRow";
import type * as listMessages from "../listMessages";
import type * as listResponses from "../listResponses";
import type * as listRoom from "../listRoom";
import type * as sendEmail from "../sendEmail";
import type * as sendMessage from "../sendMessage";
import type * as sendQuickQuestion from "../sendQuickQuestion";
import type * as sendResponse from "../sendResponse";

/**
 * A type describing your app's public Convex API.
 *
 * This `API` type includes information about the arguments and return
 * types of your app's query and mutation functions.
 *
 * This type should be used with type-parameterized classes like
 * `ConvexReactClient` to create app-specific types.
 */
export type API = ApiFromModules<{
  createRoom: typeof createRoom;
  deleteRow: typeof deleteRow;
  listMessages: typeof listMessages;
  listResponses: typeof listResponses;
  listRoom: typeof listRoom;
  sendEmail: typeof sendEmail;
  sendMessage: typeof sendMessage;
  sendQuickQuestion: typeof sendQuickQuestion;
  sendResponse: typeof sendResponse;
}>;
