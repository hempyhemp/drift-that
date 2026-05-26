import type { NitroFetchRequest } from 'nitropack'

interface CustomFetchOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
}

export function $api(
  request: NitroFetchRequest,
  options?: CustomFetchOptions,
) {
  return $fetch(request, {
    ...options,
    retry: false,
    baseURL: 'https://api.drift-that.ru/',
  })
}
