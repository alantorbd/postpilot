class AppError extends Error {
  statusCode: number | undefined;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
export default AppError;
