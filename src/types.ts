// deno-lint-ignore-file no-explicit-any
import type { RouteParams, RouterContext } from "@deps";

export interface FormError {
  field: string;
  message: string;
}

export type OakContext<R extends string> = RouterContext<
  R,
  RouteParams<R>,
  Record<string, any>
>;

export type NextFunction<T> = () => Promise<T>;

export type MyError = Error | null;

export type ServiceReturn<T> = [T, MyError, number];