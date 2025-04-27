function getFormattedDateTime() {
  const time = new Date();
  return {
      date: time.toISOString().slice(0, 10).replace(/-/g, ""), // YYYYMMDD
      time: time.toTimeString().slice(0, 8).replace(/:/g, "")   // HHMMSS
  };
}

module.exports = { getFormattedDateTime };