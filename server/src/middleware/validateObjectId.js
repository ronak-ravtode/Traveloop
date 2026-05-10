export const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  const validIdPattern = /^[a-zA-Z0-9]{20,}$/;
  if (!validIdPattern.test(id)) {
    return res.status(400).json({ error: `Invalid ${paramName} format` });
  }
  next();
};

export const validateShareCode = (req, res, next) => {
  const { shareCode } = req.params;
  if (!shareCode || shareCode.length < 4) {
    return res.status(400).json({ error: 'Invalid share code' });
  }
  next();
};