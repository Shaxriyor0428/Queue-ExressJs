const errorHandler = (error, res) => {
  console.log(error);
  return res.status(500).send(error.message);
};

export { errorHandler };
