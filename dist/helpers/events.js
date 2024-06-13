"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_UPDATED = exports.PRODUCT_EXPIRED = exports.PRODUCT_REMOVED = exports.PRODUCT_ADDED = exports.productLifecycleEmitter = void 0;
const events_1 = require("events");
const notifications_1 = require("./notifications");
class ProductLifecycleEmitter extends events_1.EventEmitter {
}
exports.productLifecycleEmitter = new ProductLifecycleEmitter();
exports.PRODUCT_ADDED = 'productAdded';
exports.PRODUCT_REMOVED = 'productRemoved';
exports.PRODUCT_EXPIRED = 'productExpired';
exports.PRODUCT_UPDATED = 'productUpdated';
exports.productLifecycleEmitter.on(exports.PRODUCT_ADDED, (product) => {
    (0, notifications_1.sendInAppNotification)(product, 'Product added', 'product_added');
});
exports.productLifecycleEmitter.on(exports.PRODUCT_REMOVED, (product) => {
    (0, notifications_1.sendInAppNotification)(product, 'Product removed', 'product_removed');
});
exports.productLifecycleEmitter.on(exports.PRODUCT_UPDATED, (product) => {
    (0, notifications_1.sendInAppNotification)(product, 'Product updated', 'product_updated');
});
exports.productLifecycleEmitter.on(exports.PRODUCT_EXPIRED, (product) => {
    (0, notifications_1.sendInAppNotification)(product, 'Product expired', 'product_expired');
});
