/**
 * 安全执行 Supabase 查询的封装函数
 * 自动捕获网络错误并返回统一格式的结果
 * 
 * @param query - 返回 Promise 的 Supabase 查询函数
 * @returns 查询结果对象，包含数据、错误和网络错误标识
 */
export async function safeQuery<T>(
  query: () => any
): Promise<{ data: T | null; error: any; isNetworkError: boolean }> {
  try {
    const queryResult = query()
    const result = await queryResult
    return {
      data: result.data,
      error: result.error,
      isNetworkError: false,
    }
  } catch (error) {
    console.error('Network error during Supabase query:', error)
    return {
      data: null,
      error,
      isNetworkError: true,
    }
  }
}

/**
 * 判断错误是否为网络连接错误
 * 
 * @param error - 错误对象
 * @returns 是否为网络错误
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false
  if (error.message) {
    return (
      error.message.includes('Failed to fetch') ||
      error.message.includes('ERR_CONNECTION') ||
      error.message.includes('ERR_PROXY_CONNECTION') ||
      error.message.includes('NetworkError') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ETIMEDOUT')
    )
  }
  return false
}