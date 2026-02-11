/**
 * Discriminated union for API responses, inspired by Go's (value, error)
 * tuples and Elixir's {:ok, value} | {:error, reason} pattern.
 *
 * Usage:
 *   const result: ApiResult<User> = await fetchUser(id);
 *   if (result.success) {
 *     console.log(result.data); // fully typed as User
 *   } else {
 *     console.error(result.error); // fully typed as ApiError
 *   }
 */

export type ApiResult<TData> = ApiSuccess<TData> | ApiFailure;

export type ApiSuccess<TData> = {
  success: true;
  data: TData;
};

export type ApiFailure = {
  success: false;
  error: ApiError;
};

export type ApiError = {
  message: string;
  status?: number;
};

export function apiSuccess<TData>(data: TData): ApiSuccess<TData> {
  return { success: true, data };
}

export function apiFailure(message: string, status?: number): ApiFailure {
  return { success: false, error: { message, status } };
}
