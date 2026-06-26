# Phase 3: Requirements Gathering

*Note: Stakeholder Analysis, Functional, and Non-Functional Requirements are already documented in `cartzone-frontend-prd.md` and `cartzone-frontend-technical-architecture.md`.*

## User Stories

### As a Guest User:
- **US01:** As a guest user, I want to browse products by category so that I can easily find the type of item I am looking for.
- **US02:** As a guest user, I want to search for products using keywords so that I can quickly find specific items.
- **US03:** As a guest user, I want to add items to my shopping basket so that I can purchase multiple items at once.
- **US04:** As a guest user, I want my shopping basket to persist locally so that I don't lose my items if I accidentally close the browser.

### As a Registered Customer:
- **US05:** As a customer, I want to create an account and log in securely so that my personal details and order history are saved.
- **US06:** As a customer, I want to save my delivery address so that I don't have to re-enter it every time I check out.
- **US07:** As a customer, I want to securely pay using my credit card via Stripe so that my payment information is safe.
- **US08:** As a customer, I want to view my past orders so that I can track my purchases and review my spending.

### As a System / Admin User (Future Scope):
- **US09:** As an admin, I want to add new products to the database so that the catalog stays up to date.
- **US10:** As an admin, I want to view all customer orders so that I can manage fulfillment.

## Detailed Use Cases

### Use Case 1: Add Item to Basket
- **Actor:** Guest User / Registered Customer
- **Precondition:** The user is on the Product Details page.
- **Main Flow:**
  1. User selects the desired quantity.
  2. User clicks the "Add to Cart" button.
  3. The frontend sends a request to the `/api/Basket` endpoint.
  4. The backend updates the Redis cache with the new basket state.
  5. The system returns the updated basket and displays a success notification to the user.
- **Alternative Flow:** If the API fails, the system shows an error message and does not add the item.

### Use Case 2: Checkout and Payment
- **Actor:** Registered Customer
- **Precondition:** The user is logged in, has items in their basket, and has provided a delivery address.
- **Main Flow:**
  1. User proceeds to the Checkout page.
  2. User selects a Delivery Method.
  3. The system calls `/api/Payments/{basketId}` to generate a Stripe Client Secret.
  4. User enters their credit card details in the Stripe Element.
  5. User clicks "Submit Order".
  6. Stripe confirms the payment and triggers the backend Webhook.
  7. The backend creates an Order in the SQL database.
  8. The user is redirected to the "Payment Success" page.
- **Alternative Flow:** If payment fails (e.g., insufficient funds), Stripe returns an error, the order is not placed, and the user is kept on the Checkout page with an error message.
