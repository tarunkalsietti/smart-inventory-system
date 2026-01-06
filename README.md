#                                   Smart Inventory Reservation System




## Overview
This project implements a **concurrency-safe inventory reservation system** designed for high-traffic scenarios such as flash sales.  
It ensures inventory is never oversold, abandoned carts do not permanently block stock, and duplicate client requests do not cause inconsistent state.

The system focuses on **correctness under concurrency**, not UI complexity.

---

## Core Features
- Atomic inventory reservation using **Redis Lua scripts**
- TTL-based reservations to prevent abandoned cart blocking
- Automatic inventory restoration via periodic cleanup job
- Fully **idempotent APIs** for retries and page refreshes
- Safe confirm and cancel flows
- Clean layered architecture (Controller / Service / Repository)

---

## API Endpoints
1. POST /inventory/reserve
2. POST /checkout/confirm
3. POST /checkout/cancel
4. GET /inventory/{sku}




<!-- (Debug APIs are used only for testing) -->

---

## Architecture
- **Express.js** – API layer
- **Redis** – single source of truth for inventory & reservations
- **Redis Lua scripts** – atomic check-and-reserve logic
- **Background cleanup job** – restores inventory for expired reservations

---

## Redis Key Design

1. inventory:{sku} -> available inventory count
2. reservation:{reservationId} -> reservation data (JSON)
3. idem:{scope}:{key} -> idempotency cache





---

## Concurrency Handling
Inventory reservation is performed using a Redis Lua script that atomically:
1. Checks inventory availability
2. Decrements inventory
3. Creates a reservation with TTL

This guarantees inventory can **never go negative**, even under heavy concurrent requests.

---

## Idempotency Strategy
All write APIs support an `Idempotency-Key` header.
- Successful responses are cached and replayed for retries
- Duplicate requests do not re-run business logic
- Error responses are not cached

This safely handles retries, refreshes, and network failures.

---

## Reservation Expiry Handling
- Reservations are created with a fixed TTL (5 minutes)
- A periodic cleanup job scans for expired ACTIVE reservations
- Inventory is restored automatically for expired reservations
- This prevents abandoned carts from permanently blocking inventory

This approach is restart-safe and aligns with the problem statement’s allowance for best-effort handling.

---

## Design Tradeoffs
- Redis chosen over SQL for atomic counters and TTL support
- Lua scripts used to eliminate race conditions
- Cleanup job used instead of keyspace notifications for simplicity and robustness
- Focused on backend correctness rather than frontend complexity

---

## Conclusion
This system demonstrates how to build a **correct, concurrency-safe reservation engine** suitable for real-world flash-sale scenarios while maintaining clean architecture and clarity.




