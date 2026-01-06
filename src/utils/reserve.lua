-- reserve.lua
-- Atomic inventory reservation script

-- KEYS[1] = inventory key (inventory:{sku})
-- KEYS[2] = reservation key (reservation:{reservationId})

-- ARGV[1] = reservation data (JSON)
-- ARGV[2] = reservation TTL in seconds

local stock = tonumber(redis.call("GET", KEYS[1]))
-- it work is to get current stock

-- No stock available
if not stock or stock <= 0 then
  return { err = "OUT_OF_STOCK" }
end

-- Decrement inventory
redis.call("DECR", KEYS[1])

-- Create reservation with TTL
redis.call("SET", KEYS[2], ARGV[1], "EX", ARGV[2])

return { ok = "RESERVED" }
