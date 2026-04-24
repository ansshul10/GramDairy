/**
 * Standard API Response Structure
 */
class ApiResponse {
  constructor(statusCode, message = 'Success', data = null, success = true) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }

  static success(res, statusCode = 200, message = 'Success', data = null) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data, true));
  }

  static error(res, statusCode = 500, message = 'Error', data = null) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data, false));
  }
}

export default ApiResponse;
