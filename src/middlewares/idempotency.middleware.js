const redisClient = require("../config/redis");
const { idempotencyKey } = require("../utils/redisKeys");

module.exports = (scope) => {
  return async (req, res, next) => {
    const key = req.headers["idempotency-key"];
    if (!key) {
      return res.status(400).json({ error: "Idempotency-Key required" });
    }

    const redisKey = idempotencyKey(scope, key);

    // ✅ 1. HARD SHORT-CIRCUIT
    const cached = await redisClient.get(redisKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // ✅ 2. Wrap res.json ONLY for success
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redisClient.setEx(redisKey, 300, JSON.stringify(body));
      }
      return originalJson(body);
    };

    next();
  };
};
