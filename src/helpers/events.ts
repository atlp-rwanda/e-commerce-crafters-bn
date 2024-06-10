import { EventEmitter } from 'events';
import Product from '../database/models/product';
import { sendInAppNotification } from './notifications';

class ProductLifecycleEmitter extends EventEmitter {}
export const productLifecycleEmitter = new ProductLifecycleEmitter();

export const PRODUCT_ADDED = 'productAdded';
export const PRODUCT_REMOVED = 'productRemoved';
export const PRODUCT_EXPIRED = 'productExpired';
export const PRODUCT_UPDATED = 'productUpdated';

productLifecycleEmitter.on(PRODUCT_ADDED, (product: Product) => {
    sendInAppNotification(product,'Product added', 'product_added');
});

productLifecycleEmitter.on(PRODUCT_REMOVED, (product: Product) => {
    sendInAppNotification(product, 'Product removed', 'product_removed');
});

productLifecycleEmitter.on(PRODUCT_UPDATED, (product: Product) => {
    sendInAppNotification(product, 'Product updated', 'product_updated');
});

productLifecycleEmitter.on(PRODUCT_EXPIRED, (product: Product) => {
    sendInAppNotification(product, 'Product expired', 'product_expired');
})
