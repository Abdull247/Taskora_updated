TaskBridge Backend — API Reference

A microtask marketplace backend where advertisers post tasks and workers complete them for pay. Built with Node.js + Fastify + PostgreSQL.

---

Table of Contents

· Authentication
· Auth
· Email Verification
· Waitlist
· User Profile
· Wallet
· Payments
· Tasks
· Submissions
· Bank Accounts
· Withdrawals
· Admin
· Service Logs

---

Authentication

Three separate auth systems:

System Token Lifetime
User JWT Authorization: Bearer <accessToken> 15 min (refresh: 30 days)
Admin JWT Authorization: Bearer <adminAccessToken> 1 hour
Service Token Authorization: Bearer <token> Static (env)

User roles: worker, advertiser, admin (admin has no public signup path).

Money values: Fields ending in Kobo are integers in kobo (1 Naira = 100 kobo). Fields ending in Naira accept decimals. Timestamps are ISO 8601 UTC.

---

Auth

POST /auth/register

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "username": "adalovelace",
  "email": "ada@taskora.dev",
  "phoneNumber": "+2348012345678",
  "password": "testpass123",
  "role": "advertiser",          // "worker" or "advertiser"
  "referredByCode": "d2ad66c7",  // optional
  "businessDetails": {           // optional, advertiser only
    "businessName": "Lovelace Analytics",
    "businessIndustry": "Software",
    "businessWebsite": "https://lovelaceanalytics.dev"
  }
}
```

201 Response:

```json
{
  "user": {
    "id": "uuid",
    "first_name": "Ada",
    "last_name": "Lovelace",
    "username": "adalovelace",
    "email": "ada@taskora.dev",
    "phone_number": "+2348012345678",
    "role": "advertiser",
    "referral_code": "d2ad66c7",
    "created_at": "...",
    "business_name": "Lovelace Analytics",
    "business_industry": "Software",
    "business_website": "https://lovelaceanalytics.dev"
  }
}
```

Errors: 400 missing/invalid, 409 duplicate email/username/phone.

---

POST /auth/login

```json
{ "email": "ada@taskora.dev", "password": "testpass123" }
```

200 Response:

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "uuid",
    "firstName": "Ada",
    "lastName": "Lovelace",
    "username": "adalovelace",
    "email": "ada@taskora.dev",
    "role": "advertiser"
  }
}
```

Errors: 400 missing fields, 401 invalid credentials.

---

POST /auth/refresh

```json
{ "refreshToken": "eyJ..." }
```

200 Response: { "accessToken": "eyJ..." }

---

POST /auth/logout

```json
{ "refreshToken": "eyJ..." }
```

200 Response: { "status": "logged out" }

---

Email Verification

🔒 Requires Authorization: Bearer <EMAIL_VERIFICATION_SERVICE_TOKEN>

POST /emailverification/send

```json
{ "email": "ada@taskora.dev" }
```

201 Response:

```json
{
  "status": "sent",
  "email": "ada@taskora.dev",
  "taskId": "9f1c2e...",
  "expiresAt": "2026-08-10T14:05:00.000Z"
}
```

---

POST /emailverification/verify

```json
{ "code": "482913", "taskId": "9f1c2e..." }
```

200 Response: { "status": "verified", "email": "ada@taskora.dev" }

---

POST /emailverification/resend

Body (one required):

```json
{ "taskId": "9f1c2e..." }
```

or

```json
{ "email": "ada@taskora.dev" }
```

200 Response:

```json
{
  "status": "resent",
  "email": "ada@taskora.dev",
  "taskId": "b71a4f...",
  "resendCount": 2,
  "expiresAt": "2026-08-10T14:10:00.000Z"
}
```

Errors: 409 already verified, 429 rate-limited (5 per 30 min).

---

Waitlist

POST /waitlist

Same as /auth/register but tags account as first access and generates first_access_code.

201 Response:

```json
{
  "user": {
    "id": "uuid",
    "first_name": "Ada",
    "last_name": "Lovelace",
    "username": "adalovelace",
    "email": "ada@taskora.dev",
    "phone_number": "+2348012345678",
    "role": "worker",
    "referral_code": "92f1b039",
    "is_first_access": true,
    "first_access_code": "FA-4207C18A",
    "created_at": "..."
  }
}
```

---

User Profile

GET /me 🔒

Returns full profile with wallet and role-specific stats.

Worker stats:

```json
{
  "stats": {
    "pendingApprovals": 2,
    "completedTasks": 14,
    "completedThisWeek": 3,
    "earningsThisMonthKobo": 12000,
    "earningsLastMonthKobo": 8000,
    "earningsDeltaKobo": 4000
  }
}
```

Advertiser stats:

```json
{
  "stats": {
    "pendingApprovals": 5,
    "completedTasks": 9,
    "completedThisWeek": 1,
    "spentThisMonthKobo": 45000,
    "spentLastMonthKobo": 30000,
    "spentDeltaKobo": 15000
  }
}
```

---

Wallet

GET /wallet 🔒

200 Response:

```json
{
  "wallet": {
    "id": "uuid",
    "balance": "50000",  // string, in kobo
    "currency": "NGN",
    "updated_at": "..."
  }
}
```

---

GET /wallet/transactions 🔒

Query params: limit (20), offset (0)

200 Response:

```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "deposit",
      "amount": "50000",
      "balance_after": "50000",
      "reference": "taskora_..._credit",
      "status": "completed",
      "metadata": { "source": "paystack" },
      "created_at": "..."
    }
  ]
}
```

Types: deposit, withdrawal, task_payment, task_earning, refund, fee

---

Payments

POST /payments/initialize 🔒

```json
{ "amountNaira": 500 }
```

200 Response:

```json
{
  "authorizationUrl": "https://checkout.paystack.com/xxxxxxxx",
  "reference": "taskora_<userId>_<timestamp>"
}
```

Redirect user to authorizationUrl. Paystack calls /payments/webhook on completion; frontend polls GET /wallet to confirm.

---

Tasks

GET /tasks/categories

No auth. Returns all categories grouped with subcategories and minimum rates.

200 Response:

```json
{
  "categories": [
    {
      "category": "WEBSITE_APP_TESTING",
      "description": "Test websites and applications...",
      "categoryId": "uuid",
      "subcategories": [
        {
          "subcategory": "WEBSITE_USABILITY_TEST",
          "displayName": "Website Usability Test",
          "baseRateKobo": 2500,
          "subcategoryId": "uuid"
        }
      ]
    }
  ]
}
```

Categories: WEBSITE_APP_TESTING, SURVEYS_POLLS, PRODUCT_SERVICE_FEEDBACK, BUG_REPORTING, PRODUCT_TESTING, CONTENT_CREATION, DATA_COLLECTION, DATA_VERIFICATION, SEARCH_RESEARCH, LEAD_GENERATION, FORM_COMPLETION, ACCOUNT_SIGNUP_ONBOARDING, MYSTERY_SHOPPING_EXPERIENCE_CHECKS

---

POST /tasks 🔒 (advertiser only)

```json
{
  "subcategoryId": "uuid",
  "jobLink": "https://example.com/survey",
  "jobDescription": "Complete this 5-minute survey",
  "proofRequired": true,
  "proofType": "SCREENSHOT",  // SCREENSHOT, USERNAME, LINK
  "quantity": 10,
  "workerEarnNaira": 25,      // must be >= baseRateKobo/100
  "expiresAt": "2026-09-01T00:00:00Z"
}
```

Errors: 400 validation, 402 insufficient balance, 403 not advertiser, 404 invalid subcategory.

---

GET /tasks 🔒

Worker feed. Returns active tasks the user hasn't submitted to.

Query params: limit (20), offset (0), categoryId, subcategoryId

200 Response:

```json
{
  "tasks": [
    {
      "id": "uuid",
      "job_link": "https://example.com/survey",
      "job_description": "Complete this 5-minute survey",
      "proof_required": true,
      "proof_type": "SCREENSHOT",
      "quantity": 10,
      "worker_earn_kobo": "2500",
      "completed_count": 0,
      "spots_remaining": 10,
      "expires_at": "...",
      "created_at": "...",
      "category_name": "SURVEYS_POLLS",
      "subcategory_name": "SURVEY",
      "advertiser_username": "adalovelace"
    }
  ]
}
```

---

GET /recommended 🔒 (worker only)

Same as /tasks but randomized. Good for "recommended for you" widget.

Query params: limit (10, max 50)

---

GET /tasks/:id 🔒

Single task detail.

---

GET /tasks/mine 🔒 (advertiser only)

All tasks created by the logged-in advertiser.

---

Submissions

POST /tasks/:id/submit 🔒 (worker only)

```json
{ "proofValue": "https://example.com/screenshot.png" }
```

⚠️ File upload not yet built — pass a URL from your own storage.

201 Response:

```json
{
  "submission": {
    "id": "uuid",
    "task_id": "uuid",
    "worker_id": "uuid",
    "proof_type": "SCREENSHOT",
    "proof_value": "https://example.com/screenshot.png",
    "status": "pending",
    "rejection_reason": null,
    "submitted_at": "...",
    "reviewed_at": null
  }
}
```

Errors: 400 task full/expired, 403 own task, 409 already submitted.

---

GET /submissions/mine 🔒 (worker only)

Worker's submission history.

---

GET /tasks/:id/submissions 🔒 (advertiser only, must own task)

All submissions for a task.

---

POST /submissions/:id/approve 🔒 (advertiser only)

Approves submission → pays worker atomically.

200 Response:

```json
{
  "status": "approved",
  "submissionId": "uuid",
  "workerPaidKobo": 2500
}
```

---

POST /submissions/:id/reject 🔒 (advertiser only)

```json
{ "reason": "Screenshot doesn't show the required step" }
```

200 Response:

```json
{ "status": "rejected", "submissionId": "uuid", "reason": "..." }
```

---

Bank Accounts

GET /banks 🔒

Returns list of Nigerian banks from Paystack.

200 Response:

```json
{
  "banks": [
    { "name": "Access Bank", "code": "044", "slug": "access-bank" }
  ]
}
```

---

POST /bank-accounts/resolve 🔒

Verifies account number via Paystack.

```json
{ "accountNumber": "0123456789", "bankCode": "044" }
```

200 Response:

```json
{ "accountName": "ADA LOVELACE", "accountNumber": "0123456789" }
```

---

GET /bank-accounts 🔒

Lists user's connected accounts.

200 Response:

```json
{
  "bankAccounts": [
    {
      "id": "uuid",
      "accountNumber": "0123456789",
      "bankCode": "044",
      "bankName": "Access Bank",
      "accountName": "ADA LOVELACE",
      "isDefault": true,
      "createdAt": "..."
    }
  ],
  "defaultBankAccount": { ... }  // null if none
}
```

---

POST /bank-accounts 🔒

Connects a bank account.

```json
{
  "accountName": "ADA LOVELACE",
  "accountNumber": "0123456789",
  "bankCode": "044",
  "bankName": "Access Bank",
  "isDefault": true  // optional
}
```

201 Response: same as GET /bank-accounts object.

Errors: 400 missing fields, 409 duplicate account.

---

PATCH /bank-accounts/:id/default 🔒

Marks account as default.

200 Response: same as GET /bank-accounts object.

---

DELETE /bank-accounts/:id 🔒

Removes account. If it was default, the most recent remaining account becomes default.

---

Withdrawals

POST /withdrawals 🔒

Minimum ₦100.

```json
{
  "amountNaira": 500,
  "accountNumber": "0123456789",
  "bankCode": "044",
  "bankName": "Access Bank"  // optional
}
```

201 Response:

```json
{
  "withdrawal": {
    "reference": "wd_<userId>_<timestamp>_<random>",
    "amountNaira": 500,
    "accountName": "ADA LOVELACE",
    "status": "success"
  }
}
```

Errors: 400 invalid/missing, 402 insufficient balance, 502 transfer failed (refunded).

---

Admin

🔒 Requires Authorization: Bearer <adminAccessToken> from /admin/login.

POST /admin/login

```json
{ "email": "admin@taskora.dev", "password": "the-admin-password" }
```

200 Response:

```json
{ "accessToken": "eyJ...", "expiresIn": 3600 }
```

5 failed attempts = 15-min IP lockout. No refresh token.

---

GET /admin/dashboard 🔒

Query params: logsLimit (20, max 200)

200 Response:

```json
{
  "data": {
    "sections": {
      "userCounts": {
        "total": 142,
        "byRole": { "worker": 110, "advertiser": 30, "admin": 2 },
        "verified": 12,
        "unverified": 130,
        "waitlistUsers": 45,
        "users": [
          { "id": "uuid", "role": "worker", "createdAt": "2026-08-01T..." }
        ]
      },
      "logs": {
        "total": 980,
        "byType": { "user": 720, "admin": 40, "general": 220 },
        "recent": [...]
      }
    }
  }
}
```

---

GET /admin/users 🔒

Query params: limit (20, max 100), offset (0), role (worker/advertiser/admin)

200 Response:

```json
{
  "users": [
    {
      "id": "uuid",
      "firstName": "Ada",
      "lastName": "Lovelace",
      "username": "adalovelace",
      "email": "ada@taskora.dev",
      "phoneNumber": "+2348012345678",
      "role": "worker",
      "referralCode": "92f1b039",
      "referredBy": null,
      "isVerified": false,
      "isFirstAccess": true,
      "firstAccessCode": "FA-4207C18A",
      "firstAccessRewardGranted": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": { "total": 142, "limit": 10, "offset": 0 }
}
```

---

GET /admin/users/:id 🔒

Full user profile (excludes wallet balance).

200 Response: same as user object from /admin/users.

---

GET /admin/users/:id/wallet 🔒

200 Response:

```json
{
  "wallet": {
    "id": "uuid",
    "userId": "uuid",
    "balanceKobo": 50000,
    "currency": "NGN",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

GET /admin/users/:id/wallet/transactions 🔒

Query params: limit (20, max 100), offset (0)

200 Response:

```json
{
  "transactions": [
    {
      "id": "uuid",
      "type": "deposit",
      "amount": 50000,
      "balance_after": 50000,
      "reference": "taskora_..._credit",
      "status": "completed",
      "metadata": { "source": "paystack" },
      "created_at": "..."
    }
  ],
  "pagination": { "total": 4, "limit": 20, "offset": 0 }
}
```

---

POST /admin/logs 🔒

Creates a log entry.

Body:

```json
{
  "userId": "uuid",  // optional
  "logType": "deposit",  // signup, login, email, submission, deposit, task-in, task-out, withdrawal
  "title": "Manual wallet adjustment",
  "body": "Support ticket #123",
  "links": ["https://support.example.com/ticket/123"],
  "logOptions": [{ "title": "View ticket", "url": "https://..." }],
  "metadata": { "adjustedBy": "admin@taskora.dev" }
}
```

201 Response: created log object.

---

GET /admin/logs 🔒

Query params: limit (20, max 100), offset (0), userId, logType

200 Response:

```json
{
  "logs": [...],
  "pagination": { "total": 980, "limit": 20, "offset": 0 }
}
```

---

GET /admin/logs/:id 🔒

Single log entry.

---

PATCH /admin/logs/:id 🔒

Update a log. Any field can be changed.

---

DELETE /admin/logs/:id 🔒

Permanently deletes a log.

---

Admin — Promotions

POST /admin/promotions 🔒

Sends a promotion email.

```json
{
  "userId": "uuid",
  "promotionName": "Hello bro update",
  "promotionBody": "This is a test promotion."
}
```

201 Response:

```json
{
  "success": true,
  "message": "Email promotion sent successfully",
  "promotion": {
    "id": "uuid",
    "userId": "uuid",
    "promotionName": "Hello bro update",
    "promotionBody": "This is a test promotion.",
    "recipient": {
      "email": "momoh6413@gmail.com",
      "firstName": "Samuel",
      "lastName": "Utum",
      "username": "Mrsmall_000",
      "phoneNumber": "09133598529",
      "role": "advertiser"
    },
    "deliveryStatus": "sent",
    "webhookResponse": { "success": true },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

502 Response: saved but failed to send.

---

POST /admin/promotions/batch 🔒

Sends to up to 10 users.

```json
{
  "userIds": ["uuid-1", "uuid-2"],
  "promotionName": "Batch promo",
  "promotionBody": "Testing batch."
}
```

200 Response:

```json
{
  "success": false,
  "message": "2/3 promotion emails sent successfully",
  "results": [
    { "userId": "uuid-1", "success": true, "promotion": {...} },
    { "userId": "uuid-3", "success": false, "error": "User not found" }
  ]
}
```

---

GET /admin/promotions 🔒

Query params: limit (20, max 100), offset (0), userId, deliveryStatus (sent/failed)

---

GET /admin/promotions/:id 🔒

Single promotion record.

---

PATCH /admin/promotions/:id 🔒

Edits stored record only — does not resend.

---

DELETE /admin/promotions/:id 🔒

Permanently deletes promotion record.

---

Service Logs

🔒 Requires Authorization: Bearer <LOGS_SERVICE_TOKEN>

Restricted logging API for internal services. Can only create logType: "email" logs.

POST /service/logs 🔒

```json
{
  "userId": "uuid",  // optional
  "logType": "email",
  "title": "n8n workflow triggered",
  "body": "Waitlist email batch sent",
  "links": ["https://workflow.example.com/run/123"],
  "logOptions": [{ "title": "View run", "url": "https://..." }],
  "metadata": { "batchSize": 12 }
}
```

Errors: 403 if logType is not "email".

---

GET /service/logs 🔒

Same as GET /admin/logs.

---

GET /service/logs/:id 🔒

Same as GET /admin/logs/:id.

---

PATCH /service/logs/:id 🔒

Update title, body, links, logOptions, metadata. Cannot change logType.

Errors: 403 if attempting to change logType.

---

Known Gaps

· First-access rewards — first_access_code generated but not redeemable yet.
· File upload — submissions accept URLs only; no storage endpoint yet.
· Admin oversight — no routes for task suspension, withdrawal queue, or submission moderation.
· Logs wiring — only signup, login, and email are auto-written; others must be manual.
· Withdrawals don't reuse saved bank accounts — currently re-resolves every time.
· Migration runner has no tracking table — runs all migrations on every invocation.
· Admin dashboard logs.byType still uses old categories (user/admin/general).