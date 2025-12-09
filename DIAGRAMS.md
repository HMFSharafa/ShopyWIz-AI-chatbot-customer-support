# ShopEase AI Customer Support System - Visual Diagrams

This document contains visual diagrams in Mermaid format that can be rendered in Markdown viewers that support Mermaid (GitHub, GitLab, VS Code with Mermaid extension, etc.).

---

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>Port 3000]
        A1[Navbar]
        A2[Hero Section]
        A3[Featured Products]
        A4[Chatbot Widget]
        A --> A1
        A --> A2
        A --> A3
        A --> A4
    end
    
    subgraph "API Layer"
        B[Express.js Server<br/>Port 5000]
        B1[CORS Middleware]
        B2[Body Parser]
        B3[Error Handler]
        B --> B1
        B1 --> B2
        B2 --> B3
    end
    
    subgraph "Route Handlers"
        C1[POST /api/chat]
        C2[GET /api/orders/:id]
        C3[GET /api/products]
        B3 --> C1
        B3 --> C2
        B3 --> C3
    end
    
    subgraph "Business Logic"
        D[Intent Detection Engine]
        D1[Order Status Handler]
        D2[Return Policy Handler]
        D3[Product Recommendation]
        D4[Shipping Info Handler]
        D5[LLM Fallback]
        C1 --> D
        D --> D1
        D --> D2
        D --> D3
        D --> D4
        D --> D5
    end
    
    subgraph "Data Sources"
        E1[JSON Files<br/>orders.json<br/>products.json]
        E2[Groq API<br/>Llama 3.1 8B]
        D1 --> E1
        D2 --> E1
        D3 --> E1
        D4 --> E1
        D5 --> E2
    end
    
    A4 -->|HTTP POST| B
    
    style A fill:#667eea,stroke:#764ba2,color:#fff
    style B fill:#3b82f6,stroke:#1e3a8a,color:#fff
    style D fill:#10b981,stroke:#047857,color:#fff
    style E2 fill:#f59e0b,stroke:#d97706,color:#fff
```

---

## 2. Chat Message Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend<br/>(React)
    participant B as Backend<br/>(Express)
    participant I as Intent Engine
    participant D as Data Layer
    participant L as LLM<br/>(Groq)
    
    U->>F: Types message<br/>"Order ORD12345 status?"
    F->>F: Display user message
    F->>B: POST /api/chat<br/>{message: "..."}
    
    B->>I: Process message
    I->>I: Extract Order ID<br/>Pattern: ORD\d+
    
    alt Order ID Found
        I->>D: Load orders.json
        D-->>I: Order data
        I->>I: Format response
        I-->>B: Formatted response
    else No Order ID
        I->>I: Check other intents
        alt Return Policy
            I-->>B: Return policy text
        else Product Recommendation
            I->>D: Load products.json
            D-->>I: Product data
            I->>I: Match & score products
            I-->>B: Top 3 recommendations
        else LLM Fallback
            I->>L: API call with context
            L-->>I: AI-generated response
            I-->>B: LLM response
        end
    end
    
    B-->>F: {reply: "..."}
    F->>F: Display bot message
    F->>F: Auto-scroll to bottom
    F-->>U: Show response
```

---

## 3. Intent Detection Decision Tree

```mermaid
flowchart TD
    Start([User Message Received]) --> ExtractOrderID{Extract Order ID<br/>Pattern: ORD\d+}
    
    ExtractOrderID -->|Found| CheckOrder{Order Exists<br/>in Database?}
    CheckOrder -->|Yes| ReturnOrderDetails[Return Order Details<br/>Status, Delivery Date, Items]
    CheckOrder -->|No| ReturnNotFound[Return: Order Not Found<br/>Request Valid ID]
    
    ExtractOrderID -->|Not Found| CheckReturn{Keywords:<br/>return OR refund?}
    CheckReturn -->|Yes| ReturnPolicy[Return Policy Response<br/>14 days, conditions, refund timeline]
    
    CheckReturn -->|No| CheckShipping{Keywords:<br/>shipping OR delivery?}
    CheckShipping -->|Yes| ReturnShipping[Shipping Information<br/>3-5 days, express options, free shipping]
    
    CheckShipping -->|No| CheckRecommend{Keywords:<br/>recommend OR suggest?}
    CheckRecommend -->|Yes| ProductMatch[Match Products<br/>by Category/Tags]
    ProductMatch --> ScoreProducts[Score & Rank Products]
    ScoreProducts --> ReturnTop3[Return Top 3<br/>Recommendations]
    
    CheckRecommend -->|No| LLMFallback[LLM Fallback<br/>Groq API Call]
    LLMFallback --> SystemPrompt[Send System Prompt + Context]
    SystemPrompt --> LLMResponse[Generate AI Response]
    LLMResponse --> ReturnLLM[Return LLM Response]
    
    ReturnOrderDetails --> End([Send Response to Client])
    ReturnNotFound --> End
    ReturnPolicy --> End
    ReturnShipping --> End
    ReturnTop3 --> End
    ReturnLLM --> End
    
    style Start fill:#667eea,stroke:#764ba2,color:#fff
    style End fill:#10b981,stroke:#047857,color:#fff
    style LLMFallback fill:#f59e0b,stroke:#d97706,color:#fff
```

---

## 4. Frontend Component Hierarchy

```mermaid
graph TD
    A[App.jsx<br/>Main Application] --> B[Navbar.jsx]
    A --> C[Hero.jsx]
    A --> D[FeaturedProducts.jsx]
    A --> E[Chatbot.jsx]
    
    D --> D1[Product Cards]
    D --> D2[API: GET /api/products]
    
    E --> E1[ChatIcon.jsx<br/>Floating Button]
    E --> E2{Chat Open?}
    
    E2 -->|Yes| E3[ChatWindow.jsx]
    E2 -->|No| E1
    
    E3 --> E4[Chat Header<br/>Title + Close Button]
    E3 --> E5[Messages Container]
    E3 --> E6[ChatInput.jsx]
    
    E5 --> E7[MessageBubble.jsx<br/>For each message]
    E7 --> E8{Message Sender?}
    E8 -->|User| E9[User Bubble<br/>Right-aligned, Navy]
    E8 -->|Bot| E10[Bot Bubble<br/>Left-aligned, White]
    
    E6 --> E11[Input Field]
    E6 --> E12[Send Button]
    E12 --> E13[API: POST /api/chat]
    E13 --> E5
    
    style A fill:#667eea,stroke:#764ba2,color:#fff
    style E fill:#3b82f6,stroke:#1e3a8a,color:#fff
    style E3 fill:#10b981,stroke:#047857,color:#fff
```

---

## 5. Product Recommendation Scoring Algorithm

```mermaid
flowchart LR
    Start([User Query:<br/>'Recommend headphones']) --> Extract[Extract Keywords<br/>['recommend', 'headphones']]
    
    Extract --> Loop[For Each Product<br/>in Database]
    
    Loop --> CheckCategory{Product Category<br/>Matches?}
    CheckCategory -->|Yes| Score1[Score += 5]
    CheckCategory -->|No| CheckTags
    
    Score1 --> CheckTags{Product Tags<br/>Match?}
    
    CheckTags -->|Exact Match| Score2[Score += 3]
    CheckTags -->|Partial Match| Score3[Score += 1]
    CheckTags -->|No Match| NextProduct
    
    Score2 --> NextProduct
    Score3 --> NextProduct
    
    NextProduct{More Products?}
    NextProduct -->|Yes| Loop
    NextProduct -->|No| Sort[Sort by Score<br/>Descending]
    
    Sort --> Top3[Select Top 3<br/>Products]
    Top3 --> Format[Format Response<br/>Name, Price, Category, Tags]
    Format --> Return([Return to User])
    
    style Start fill:#667eea,stroke:#764ba2,color:#fff
    style Return fill:#10b981,stroke:#047857,color:#fff
    style Score1 fill:#f59e0b,stroke:#d97706,color:#fff
    style Score2 fill:#f59e0b,stroke:#d97706,color:#fff
    style Score3 fill:#fbbf24,stroke:#d97706,color:#fff
```

---

## 6. Database Schema (Future Enhancement)

```mermaid
erDiagram
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS }o--|| CUSTOMERS : "placed by"
    PRODUCTS ||--o{ ORDER_ITEMS : "included in"
    PRODUCTS }o--o{ PRODUCT_TAGS : "tagged with"
    CUSTOMERS ||--o{ CHAT_HISTORY : "has"
    
    ORDERS {
        string orderId PK
        string customerId FK
        string status
        date orderDate
        date expectedDelivery
        decimal totalAmount
    }
    
    ORDER_ITEMS {
        string orderId FK
        string productId FK
        int quantity
        decimal unitPrice
    }
    
    PRODUCTS {
        string productId PK
        string name
        string category
        decimal price
        text description
        string imageUrl
    }
    
    PRODUCT_TAGS {
        string productId FK
        string tag
    }
    
    CUSTOMERS {
        string customerId PK
        string name
        string email
        string phone
    }
    
    CHAT_HISTORY {
        string chatId PK
        string customerId FK
        text userMessage
        text botResponse
        timestamp createdAt
        string intent
    }
```

---

## 7. API Request/Response Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant API as Express API
    participant Logic as Business Logic
    participant Data as Data Layer
    participant LLM as Groq API
    
    C->>API: POST /api/chat<br/>{message: "..."}
    API->>API: Validate Request
    API->>Logic: Process Message
    
    Logic->>Logic: Intent Detection
    alt Order Status
        Logic->>Data: Load orders.json
        Data-->>Logic: Order Data
        Logic->>Logic: Format Response
        Logic-->>API: Order Details
    else Product Recommendation
        Logic->>Data: Load products.json
        Data-->>Logic: Product Data
        Logic->>Logic: Score & Match
        Logic-->>API: Top Products
    else LLM Fallback
        Logic->>LLM: API Request<br/>+ System Prompt
        LLM-->>Logic: AI Response
        Logic-->>API: Formatted Response
    end
    
    API-->>C: {reply: "..."}
    C->>C: Update UI
    C->>C: Display Message
```

---

## 8. Deployment Architecture (Future)

```mermaid
graph TB
    subgraph "Client"
        U[Users]
        B[Browser]
    end
    
    subgraph "CDN"
        CDN[CloudFlare/CDN<br/>Static Assets]
    end
    
    subgraph "Frontend Hosting"
        F[Vercel/Netlify<br/>React App]
    end
    
    subgraph "Backend Infrastructure"
        LB[Load Balancer]
        API1[API Server 1]
        API2[API Server 2]
        API3[API Server N]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL<br/>Database)]
        Cache[(Redis<br/>Cache)]
    end
    
    subgraph "External Services"
        GROQ[Groq API<br/>LLM Service]
        MONITOR[Monitoring<br/>& Logging]
    end
    
    U --> B
    B --> CDN
    B --> F
    F --> LB
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> DB
    API2 --> DB
    API3 --> DB
    
    API1 --> Cache
    API2 --> Cache
    API3 --> Cache
    
    API1 --> GROQ
    API2 --> GROQ
    API3 --> GROQ
    
    API1 --> MONITOR
    API2 --> MONITOR
    API3 --> MONITOR
    
    style F fill:#667eea,stroke:#764ba2,color:#fff
    style LB fill:#3b82f6,stroke:#1e3a8a,color:#fff
    style DB fill:#10b981,stroke:#047857,color:#fff
    style GROQ fill:#f59e0b,stroke:#d97706,color:#fff
```

---

## 9. Error Handling Flow

```mermaid
flowchart TD
    Start([Request Received]) --> Validate{Valid Request?}
    
    Validate -->|No| Error400[Return 400<br/>Bad Request]
    
    Validate -->|Yes| Process[Process Request]
    Process --> TryExecute{Execute Logic}
    
    TryExecute -->|Success| Return200[Return 200<br/>Success Response]
    
    TryExecute -->|Error| ErrorType{Error Type?}
    
    ErrorType -->|Order Not Found| Error404[Return 404<br/>Order Not Found<br/>+ Helpful Message]
    
    ErrorType -->|LLM API Error| Fallback[Use Rule-Based<br/>Fallback Response]
    Fallback --> Return200
    
    ErrorType -->|File Read Error| Error500[Return 500<br/>Internal Error<br/>+ Generic Message]
    
    ErrorType -->|Network Error| Error503[Return 503<br/>Service Unavailable<br/>+ Retry Suggestion]
    
    Return200 --> Log[Log Success]
    Error400 --> Log
    Error404 --> Log
    Error500 --> Log
    Error503 --> Log
    Log --> End([Response Sent])
    
    style Start fill:#667eea,stroke:#764ba2,color:#fff
    style Return200 fill:#10b981,stroke:#047857,color:#fff
    style Error400 fill:#ef4444,stroke:#dc2626,color:#fff
    style Error404 fill:#f59e0b,stroke:#d97706,color:#fff
    style Error500 fill:#ef4444,stroke:#dc2626,color:#fff
    style Fallback fill:#3b82f6,stroke:#1e3a8a,color:#fff
```

---

## 10. State Management Flow (Frontend)

```mermaid
stateDiagram-v2
    [*] --> Initial: Component Mounts
    
    Initial --> ChatClosed: Render Homepage
    ChatClosed --> ChatOpening: User Clicks Icon
    ChatOpening --> ChatOpen: Animation Complete
    
    ChatOpen --> WaitingInput: Display Welcome Message
    WaitingInput --> UserTyping: User Types
    UserTyping --> WaitingInput: User Deletes
    
    WaitingInput --> Sending: User Clicks Send
    UserTyping --> Sending: User Presses Enter
    
    Sending --> Loading: API Call Initiated
    Loading --> Success: Response Received
    Loading --> Error: API Error
    
    Success --> WaitingInput: Display Response
    Error --> WaitingInput: Display Error Message
    
    WaitingInput --> ChatClosing: User Clicks Close
    ChatClosing --> ChatClosed: Animation Complete
    
    ChatClosed --> [*]: Component Unmounts
    ChatOpen --> [*]: Component Unmounts
    
    note right of Loading
        Show loading animation
        Disable input
    end note
    
    note right of Success
        Add message to state
        Auto-scroll
        Re-enable input
    end note
```

---

## How to View These Diagrams

### Option 1: GitHub/GitLab
These Mermaid diagrams will render automatically when viewing this file on GitHub or GitLab.

### Option 2: VS Code
Install the "Markdown Preview Mermaid Support" extension to view diagrams in VS Code.

### Option 3: Online Tools
1. Copy the Mermaid code block
2. Paste into https://mermaid.live/
3. View and export as image

### Option 4: VS Code Extensions
- "Markdown Preview Mermaid Support"
- "Mermaid Editor"
- "Markdown Preview Enhanced"

---

**End of Diagrams Document**

