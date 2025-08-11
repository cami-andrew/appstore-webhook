function errorHandler(err, req, res, next) {
  console.error("❌ 예상치 못한 오류:", err.stack || err);
  res.status(500).send("내부 서버 오류");
}

module.exports = { errorHandler };
