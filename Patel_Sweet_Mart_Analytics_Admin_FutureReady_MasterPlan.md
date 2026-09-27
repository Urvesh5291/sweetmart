# 🏛️ Patel Sweet Mart — Analytics, Admin Command Center & Future-Ready Master Plan

**Brand**: Patel Sweet Mart (પટેલ સ્વીટ માર્ટ) — Estd. 1995  
**Locations**: Main Bazar, Kherwa & Ahmedabad, Gujarat  
**Technology Architecture**: HTML5, Vanilla CSS3, Modern ES6+ JavaScript, Supabase Cloud Database (PostgreSQL)  
**Document Version**: 2.0 (Executive Production Master Plan)

---

## Executive Summary

Patel Sweet Mart is transitioning from a traditional brick-and-mortar landmark in North Gujarat into a modern, digitally powered omnichannel e-commerce enterprise. This master plan outlines:
1. **The First-Party Business Analytics Suite**: 100% owned, real-time data intelligence for the business owner.
2. **The Supabase Relational Database Architecture**: Secure PostgreSQL tables for orders, custom fractional weights, customer directory, live inventory, and visitor events.
3. **The Executive Admin Command Center (`website/admin.html`)**: Real-time order dispatching, kitchen batch forecasting, customer CRM, Excel export, and live rate control.
4. **The Future-Ready Scaling Roadmap**: Phased expansion covering automated WhatsApp Cloud API, dynamic UPI payments, multi-city delivery routing, and NRI festival hampers.

---

## 1. Database Architecture (Supabase PostgreSQL)

### 1.1 Relational Schema Definitions

```sql
-- 1. ORDERS TABLE
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,               -- e.g. 'PSM-7492'
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_city TEXT NOT NULL,                    -- 'ખેરવા (Kherwa)', 'અમદાવાદ (Ahmedabad)', 'અન્ય'
  delivery_address TEXT NOT NULL,
  order_notes TEXT,                               -- Festival, Pooja, Delivery timing instructions
  total_amount NUMERIC(10,2) NOT NULL,
  total_items INT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid_cod', 'paid_upi')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDER ITEMS TABLE (Supports All Fractional & Custom Weights)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,                       -- 'toprapak', 'mohanthal', etc.
  product_name_gu TEXT NOT NULL,
  product_name_en TEXT NOT NULL,
  weight_label TEXT NOT NULL,                     -- e.g. '1.25kg (સવા કિલો)', '500g (અડધો કિલો)'
  weight_kg NUMERIC(6,3) NOT NULL,                -- 1.250, 0.500, etc.
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

-- 3. LIVE PRODUCT INVENTORY & RATES TABLE
CREATE TABLE products_meta (
  id TEXT PRIMARY KEY,                            -- 'toprapak'
  name_gu TEXT NOT NULL,
  name_en TEXT NOT NULL,
  base_price_1kg NUMERIC(10,2) NOT NULL,          -- e.g. 500
  is_available BOOLEAN DEFAULT TRUE,              -- Toggle In-Stock / Sold-Out
  category TEXT NOT NULL,                         -- 'mithai', 'namkeen', 'gifting'
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FIRST-PARTY ANALYTICS & VISITOR EVENTS TABLE
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,                       -- 'page_view', 'weight_stepped', 'add_to_cart', 'whatsapp_checkout'
  product_id TEXT,
  metadata JSONB,                                 -- { weight: '1.25kg', city: 'Kherwa', device: 'mobile' }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime stream for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE products_meta;
```

---

## 2. First-Party Business Analytics Suite

Unlike black-box third-party tools, this suite gives the owner immediate operational clarity across 6 core scenarios:

### Scenario 1: Kitchen Production & Batch Forecasting (Daily Halwai Planning)
- **Objective**: Inform the kitchen chefs (*Halwais*) exactly how many kilograms of each sweet to prepare before 9:00 AM.
- **Metrics**: Aggregated KG ordered per product for the active delivery day:
  - *ટોપરાપાક (Toprapak)*: Total KG ordered
  - *મોહનથાળ (Mohanthal)*: Total KG ordered
  - *માવા પેંડા (Mava Penda)*: Total KG ordered
- **Operational Value**: Eliminates stockouts and prevents over-preparation waste of fresh Desi Ghee items.

### Scenario 2: Fractional Weight Distribution Intelligence
- **Objective**: Optimize packaging box procurement and kitchen portioning.
- **Metrics**: Percentage breakdown of purchases by weight package:
  - 250g (Tasting / Single portion)
  - 500g (Daily tea snacks)
  - 1 kg (Standard family pack)
  - 1.25 kg — સવા કિલો (Pooja, Mandir Prasad, sacred occasions)
  - 1.5 kg, 2 kg, 5 kg (Family gatherings & corporate events)

### Scenario 3: Delivery Zone & Route Intelligence
- **Objective**: Optimize same-day delivery dispatch between Kherwa and Ahmedabad.
- **Metrics**: Order volume and revenue split across:
  - **Zone A**: ખેરવા (Store pickup & local doorstep delivery)
  - **Zone B**: અમદાવાદ (Bulk express courier & same-day drop)
  - **Zone C**: અન્ય ગુજરાત (Mehsana, Gandhinagar, Surat)

### Scenario 4: E-Commerce Conversion Funnel
- **Objective**: Track visitor engagement and drop-offs.
- **Funnel Stages**:
  1. Store Visitors
  2. Product Detail Views
  3. Weight Stepper Customizations (±250g interactions)
  4. Cart Additions
  5. WhatsApp Dispatch Confirmations

### Scenario 5: Customer Directory & Lifetime Value (CRM)
- **Objective**: Identify VIP patrons and power festival broadcast marketing.
- **Metrics**: Repeat order rate, average order value (AOV), total lifetime spend.
- **Action**: 1-Click Export to Excel/CSV for Diwali and Raksha Bandhan WhatsApp greeting broadcasts.

### Scenario 6: Festive Surge & Peak Hours Tracking
- **Objective**: Handle seasonal peaks (Diwali, Uttarayan, Wedding months).
- **Metrics**: Hourly order velocity, comparison between festival periods.

---

## 3. Admin Command Center Architecture (`website/admin.html`)

### 3.1 Visual Design & Brand Alignment
- **Palette**: Deep Royal Cobalt (`#173F8A`), Metallic Gold (`#D4AF37`), Charcoal Carbon (`#242424`), Warm Cream (`#FCFAF6`).
- **Typography**: Noto Serif Gujarati & Inter for clean numerical and tabular scannability.
- **Layout**: High-density desktop & tablet responsive dashboard with sticky header, KPI row, tabbed views, and quick action drawers.

### 3.2 Dashboard Modules
1. **Executive Top Bar**: Live sync status, active date filter, store status indicator, owner profile, logout.
2. **Real-Time KPI Strip**: Today's Revenue, Active Orders, Total KG Sold Today, Conversion Rate.
3. **Live Orders Table**: Search by Name/Phone/Order ID, status filters (`All`, `New`, `Confirmed`, `Packed`, `Dispatched`, `Delivered`).
4. **Order Detail & Action Drawer**:
   - Customer details with 1-click **WhatsApp Chat** and **Phone Call**.
   - Itemized package list with custom weights.
   - 1-Click Status buttons (`Mark Confirmed`, `Mark Packed`, `Mark Dispatched`).
   - 1-Click **Print Kitchen & Delivery Slip** with customer address.
5. **Kitchen Batch Sheet View**: Table summarizing total kilograms to prepare for today's orders.
6. **Live Rate & Stock Controller**: Real-time editor for 1kg base prices and in-stock toggles.
7. **Customer CRM Directory**: Filterable patron list with lifetime spend and 1-click Excel/CSV export.
8. **Visual Analytics Charts**: Interactive CSS/SVG visualizations for weekly revenue, weight distribution, and zone share.

---

## 4. Future-Ready Technical Roadmap

| Phase | Timeline | Core Milestones |
| :--- | :--- | :--- |
| **Phase 1: Foundation** | Current | • Standalone high-speed website<br>• Custom ±250g weight steppers<br>• LocalStorage persistence + WhatsApp dispatch<br>• Supabase schema and Admin Command Center v1 |
| **Phase 2: Automation** | 1 - 3 Months | • Official WhatsApp Business Cloud API integration for 2-way order bot<br>• Instant Dynamic UPI QR Code generator (0% transaction fee)<br>• PWA offline app caching with "Install App" prompt on mobile |
| **Phase 3: Scale** | 3 - 6 Months | • Multi-store inventory sync (Kherwa central kitchen + Ahmedabad hub)<br>• Corporate Gifting bulk CSV upload portal<br>• NRI Overseas delivery payments for US/UK/Canada Gujaratis |

---

*Patel Sweet Mart — Purity, Tradition & Digital Excellence Since 1995.*
