# Phase 6: Testing & QA

## 1. Test Plan Document

**Objective:**  
To ensure the CartZone e-commerce platform functions reliably, securely, and intuitively across both the frontend React application and the backend ASP.NET Core API.

**Testing Strategy:**
1. **Unit Testing:** Backend business logic (Services/Repositories) using xUnit.
2. **Integration Testing:** API endpoint functionality (Auth, Cart, Order) using Postman/Swagger.
3. **UI/UX Testing:** Manual testing of responsive layouts and state management on the React frontend.
4. **User Acceptance Testing (UAT):** Verifying the end-to-end shopping journey (Add to Cart -> Checkout -> Payment Success).

**Tools Used:**
- Swagger UI (Backend API Testing)
- React Testing Library / Vitest (Frontend Components)
- Stripe CLI (Payment Webhook Testing)

## 2. Manual Test Cases

| Test ID | Module | Scenario | Expected Result | Pass/Fail |
|---------|--------|----------|-----------------|-----------|
| **TC-01** | Auth | User attempts to register with an existing email. | System returns a validation error "Email is in use". | |
| **TC-02** | Auth | User logs in with correct credentials. | Token is returned, user is redirected to the home page, header updates. | |
| **TC-03** | Catalog | User applies a "Price: Low to High" sort filter. | Product grid re-renders immediately in ascending price order. | |
| **TC-04** | Catalog | User searches for a non-existent product keyword. | System displays a friendly "No products found" empty state. | |
| **TC-05** | Cart | Guest user adds an item and refreshes the page. | Cart retains the item using local storage `basket_key` and Redis. | |
| **TC-06** | Checkout | User tries to checkout without an address. | System blocks payment step and highlights missing address fields. | |
| **TC-07** | Payment | User submits a valid test credit card. | Order is saved, database updates, user sees "Success" page. | |
| **TC-08** | Payment | User submits a declined test credit card. | Payment fails, order is NOT saved, user stays on checkout with error. | |
