import { Response } from 'express';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type JsonSafe<T> = T extends bigint
  ? string
  : T extends Date
    ? T
    : T extends Array<infer U>
      ? JsonSafe<U>[]
      : T extends object
        ? { [K in keyof T]: JsonSafe<T[K]> }
        : T;

function toJsonSafe<T>(value: T): JsonSafe<T> {
  if (typeof value === 'bigint') {
    return value.toString() as JsonSafe<T>;
  }

  if (value instanceof Date || value === null || typeof value !== 'object') {
    return value as JsonSafe<T>;
  }

  if (Array.isArray(value)) {
    return value.map((item) => toJsonSafe(item)) as JsonSafe<T>;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, toJsonSafe(item)]),
  ) as JsonSafe<T>;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: toJsonSafe(data),
    });
  }

  static created<T>(res: Response, data: T, message = 'Created') {
    return ApiResponse.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response,
    data: T[],
    meta: PaginationMeta,
    message = 'Success',
  ) {
    return res.status(200).json({
      success: true,
      message,
      data: toJsonSafe(data),
      meta: toJsonSafe(meta),
    });
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
