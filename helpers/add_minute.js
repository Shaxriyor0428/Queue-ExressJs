function addminute(date, minute) {
  return new Date(date.getTime() + minute * 60000);
}

export { addminute };
