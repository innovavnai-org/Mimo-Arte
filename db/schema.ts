import { integer, real, sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(), name: text("name").notNull(), slug: text("slug").notNull(), category: text("category").notNull(),
  description: text("description").notNull().default(""), price: real("price").notNull(), active: integer("active", { mode:"boolean" }).notNull().default(true),
  stock: integer("stock"), weightGrams: integer("weight_grams"), dimensionsJson: text("dimensions_json"), optionsJson: text("options_json").notNull().default("[]"), createdAt: integer("created_at").notNull(),
}, t => [uniqueIndex("idx_products_slug").on(t.slug), index("idx_products_category_active").on(t.category,t.active)]);

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull(), phone: text("phone").notNull(), normalizedIdentity: text("normalized_identity").notNull(), createdAt: integer("created_at").notNull(),
}, t => [uniqueIndex("idx_customers_identity").on(t.normalizedIdentity)]);

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(), displayNumber: text("display_number").notNull(), customerId: text("customer_id").references(()=>customers.id), status: text("status").notNull(),
  paymentStatus: text("payment_status").notNull(), paymentMethod: text("payment_method"), paymentProviderRef: text("payment_provider_ref"),
  subtotal: real("subtotal").notNull(), discount: real("discount").notNull().default(0), shipping: real("shipping").notNull(), total: real("total").notNull(),
  shippingAddressJson: text("shipping_address_json").notNull(), trackingCode: text("tracking_code"), secureTokenHash: text("secure_token_hash").notNull(), createdAt: integer("created_at").notNull(), updatedAt: integer("updated_at").notNull(),
}, t => [uniqueIndex("idx_orders_display_number").on(t.displayNumber), uniqueIndex("idx_orders_secure_token").on(t.secureTokenHash), index("idx_orders_customer_status").on(t.customerId,t.status)]);

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(), orderId: text("order_id").notNull().references(()=>orders.id), productId: text("product_id").notNull().references(()=>products.id),
  productSnapshotJson: text("product_snapshot_json").notNull(), personalizationJson: text("personalization_json").notNull(), quantity: integer("quantity").notNull(), unitPrice: real("unit_price").notNull(), subtotal: real("subtotal").notNull(),
}, t => [index("idx_order_items_order").on(t.orderId)]);

export const uploads = sqliteTable("uploads", {
  id: text("id").primaryKey(), orderItemId: text("order_item_id").references(()=>orderItems.id), objectKey: text("object_key").notNull(), originalName: text("original_name").notNull(), contentType: text("content_type").notNull(), sizeBytes: integer("size_bytes").notNull(), createdAt: integer("created_at").notNull(),
}, t => [uniqueIndex("idx_uploads_object_key").on(t.objectKey), index("idx_uploads_item").on(t.orderItemId)]);

export const artVersions = sqliteTable("art_versions", {
  id: text("id").primaryKey(), orderItemId: text("order_item_id").notNull().references(()=>orderItems.id), version: integer("version").notNull(), objectKey: text("object_key").notNull(), status: text("status").notNull(), approvedAt: integer("approved_at"), createdAt: integer("created_at").notNull(),
}, t => [uniqueIndex("idx_art_item_version").on(t.orderItemId,t.version)]);

export const artRevisionRequests = sqliteTable("art_revision_requests", {
  id: text("id").primaryKey(), artVersionId: text("art_version_id").notNull().references(()=>artVersions.id), message: text("message").notNull(), sequence: integer("sequence").notNull(), createdAt: integer("created_at").notNull(),
}, t => [uniqueIndex("idx_revision_version_sequence").on(t.artVersionId,t.sequence)]);

export const orderEvents = sqliteTable("order_events", {
  id: text("id").primaryKey(), orderId: text("order_id").notNull().references(()=>orders.id), eventType: text("event_type").notNull(), actorType: text("actor_type").notNull(), metadataJson: text("metadata_json").notNull().default("{}"), createdAt: integer("created_at").notNull(),
}, t => [index("idx_order_events_order_created").on(t.orderId,t.createdAt)]);

export const promotions = sqliteTable("promotions", {
  id: text("id").primaryKey(), kind: text("kind").notNull(), active: integer("active", {mode:"boolean"}).notNull().default(true), percentage: real("percentage").notNull(), minimumSubtotal: real("minimum_subtotal").notNull(), validFrom: integer("valid_from"), validUntil: integer("valid_until"), rulesJson: text("rules_json").notNull().default("{}"),
});

export const promotionUses = sqliteTable("promotion_uses", {
  id: text("id").primaryKey(), promotionId: text("promotion_id").notNull().references(()=>promotions.id), customerIdentityHash: text("customer_identity_hash").notNull(), orderId: text("order_id").notNull().references(()=>orders.id), usedAt: integer("used_at").notNull(),
}, t => [uniqueIndex("idx_promo_identity_once").on(t.promotionId,t.customerIdentityHash)]);

export const settings = sqliteTable("settings", { key: text("key").primaryKey(), valueJson: text("value_json").notNull(), updatedAt: integer("updated_at").notNull() });
