export const sendSuccess = (res: any, data: any, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (res: any, error: { code: string; message: string }, statusCode: number = 400) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};
