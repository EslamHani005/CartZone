# Phase 4: System Analysis & Design (Academic Diagrams)

## 1. Use Case Diagram
This diagram shows how different actors interact with the CartZone system.

```mermaid
usecaseDiagram
    actor Guest
    actor Customer
    actor Admin

    package "CartZone System" {
        usecase "Browse Products" as UC1
        usecase "Search & Filter" as UC2
        usecase "Add to Cart" as UC3
        usecase "Register / Login" as UC4
        usecase "Manage Address" as UC5
        usecase "Checkout & Pay" as UC6
        usecase "Manage Products" as UC7
    }

    Guest --> UC1
    Guest --> UC2
    Guest --> UC3
    Guest --> UC4

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6

    Admin --> UC7
```

## 2. Data Flow Diagram (DFD) - Level 0 Context
Shows the system boundary and external entities.

```mermaid
graph TD
    C[Customer] -->|Search, Add to Cart, Pay| S((CartZone System))
    S -->|Order Confirmation, Catalog| C
    S -->|Payment Request| P[Stripe Payment Gateway]
    P -->|Payment Status| S
    S -->|Email Notification| E[Email Service]
```

## 3. Sequence Diagram (Checkout Flow)
Shows the exact steps taken to complete an order.

```mermaid
sequenceDiagram
    actor Customer
    participant Frontend as React App
    participant API as ASP.NET Core API
    participant Stripe
    participant DB as SQL Database

    Customer->>Frontend: Clicks "Checkout"
    Frontend->>API: POST /api/Payments/{basketId}
    API->>Stripe: Create Payment Intent
    Stripe-->>API: Returns Client Secret
    API-->>Frontend: Returns Client Secret
    Frontend->>Stripe: Confirm Card Payment
    Stripe-->>Frontend: Payment Success
    Stripe-->>API: Webhook (Payment Succeeded)
    Frontend->>API: POST /api/Order (Submit Order)
    API->>DB: Save Order & Clear Basket
    DB-->>API: Order Saved
    API-->>Frontend: Returns Order ID
    Frontend-->>Customer: Shows "Payment Success" Page
```

## 4. Activity Diagram (Shopping Journey)
Shows the logical flow of a user navigating the site.

```mermaid
stateDiagram-v2
    [*] --> BrowseProducts
    BrowseProducts --> ViewDetails : Click Product
    ViewDetails --> AddToCart : Click Add
    AddToCart --> BrowseProducts : Continue Shopping
    AddToCart --> ViewCart : Go to Cart
    ViewCart --> Login : Click Checkout (If Guest)
    Login --> Checkout : Authenticated
    ViewCart --> Checkout : Already Logged In
    Checkout --> ProcessPayment
    ProcessPayment --> Success : Payment Valid
    ProcessPayment --> Checkout : Payment Failed
    Success --> [*]
```

## 5. State Diagram (Order Lifecycle)
Shows the different states an Order can be in.

```mermaid
stateDiagram-v2
    [*] --> Pending : Order Created
    Pending --> PaymentReceived : Stripe Success
    Pending --> PaymentFailed : Stripe Failed
    PaymentFailed --> Pending : Retry Payment
    PaymentReceived --> Processing : Warehouse processing
    Processing --> Shipped : Given to Courier
    Shipped --> Delivered : Customer received
    Delivered --> [*]
```

## 6. Class Diagram (Core Backend Domain)
Shows the entity relationships in C#.

```mermaid
classDiagram
    class User {
        +String Email
        +String DisplayName
        +Address Address
    }
    
    class Product {
        +Int Id
        +String Name
        +Decimal Price
        +String PictureUrl
        +Int ProductBrandId
        +Int ProductTypeId
    }

    class Order {
        +Int Id
        +String BuyerEmail
        +DateTime OrderDate
        +Decimal Subtotal
        +String Status
    }

    class OrderItem {
        +Int ProductId
        +String ProductName
        +Decimal Price
        +Int Quantity
    }

    class Basket {
        +String Id
        +String ClientSecret
        +String PaymentIntentId
    }

    User "1" -- "*" Order : places
    Order "1" -- "*" OrderItem : contains
    OrderItem "*" -- "1" Product : references
```

## 7. Deployment Diagram
Shows the physical and cloud infrastructure.

```mermaid
graph TD
    subgraph Client Tier
        B[Browser / React App]
    end

    subgraph App Tier (Web Server)
        API[ASP.NET Core API - Port 7005]
    end

    subgraph Data Tier
        SQL[(SQL Server Database)]
        REDIS[(Redis Cache - Basket)]
    end

    subgraph External Services
        STRIPE[Stripe API]
    end

    B <-->|HTTP/HTTPS| API
    API <-->|EF Core / SQL| SQL
    API <-->|StackExchange.Redis| REDIS
    API <-->|REST API| STRIPE
```
