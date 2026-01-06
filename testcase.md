<!-- Test 1 – Seed Inventory (Debug) -->

### POST /debug/seed-inventory

Body:
{
  "sku": "iphone15",
  "quantity": 1
}   

Expected: inventory seeded


<!-- 
Test 2 – Get Inventory -->

#   GET /inventory/iphone15

Expected:

{
  "sku": "iphone15",
  "available": 1
}


<!-- Test 3 – Reserve Inventory (Success) -->

# POST /inventory/reserve

Headers:

Idempotency-Key: r1


Body:

{
  "sku": "iphone15",
  "userId": "u1"
}



Expected:

{
  "reservationId": "<uuid>",
  "expiresIn": 300
}



<!-- Test 4 – Repeat Reserve with Same Idempotency Key -->

# POST /inventory/reserve
Headers:

Idempotency-Key: r1

Expected: same response as before



<!-- Test 5 – Reserve with New Idempotency Key (Out of Stock) -->

# POST /inventory/reserve

Headers:

Idempotency-Key: r2


Expected:

{ "error": "Out of stock" }

HTTP Status: 409


<!-- Test 6 – Confirm Reservation -->
# POST /checkout/confirm

Headers:

Idempotency-Key: c1

Body:

{
  "reservationId": "<uuid>"
}

Expected:

{ "status": "CONFIRMED" }


<!-- Test 7 – Cancel After Confirm (Safe) -->

# POST /checkout/cancel

Expected:

{ "status": "CONFIRMED" }


Inventory remains unchanged.


<!-- Test 8 -  Cancel without confirm  -->

1. reserve again with new  
2. and cancel it without  confirming
# POST /checkout/cancel

Expected result:

{ "status": "CANCELLD" }


NOW CHECK 
#   GET /inventory/iphone15

WE will get that product back 




<!-- Test 9 – Expiry Restore -->

1. Reserve inventory

2. Do not confirm or cancel

3. Wait for TTL + cleanup interval

4. Call GET /inventory/{sku}

Expected: inventory restored





