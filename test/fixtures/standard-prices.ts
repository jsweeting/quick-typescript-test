import { ProductPricing, PricingConfig } from "../../src/pricing"

export const fr1: ProductPricing = { productCode: 'FR1', config: { price: 3.11 } }
export const sr1: ProductPricing = { productCode: 'SR1', config: { price: 5.00, quantityDiscountThreshold: 3, quantityDiscountPrice: 4.50 } }
export const cf1: ProductPricing = { productCode: 'CF1', config: { price: 11.23 } }

export const standardPricingConfig: PricingConfig = new PricingConfig()
standardPricingConfig.set(fr1.productCode, fr1.config)
standardPricingConfig.set(sr1.productCode, sr1.config)
standardPricingConfig.set(cf1.productCode, cf1.config)
