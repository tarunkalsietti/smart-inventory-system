const redisClient = require("../config/redis");
const { idempotencyKey } = require("../utils/redisKeys");

module.exports = (scope) => {
  return async (req, res, next) => {
    const key = req.headers["idempotency-key"];
    if (!key) {
      return res.status(400).json({ error: "Idempotency-Key required" });
    }

    const redisKey = idempotencyKey(scope, key);
    const cached = await redisClient.get(redisKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Hook response to save later
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redisClient.setEx(redisKey, 300, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  };
};
