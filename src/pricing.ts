// export enum OfferType {
//     NONE,
//     BUY_ONE_GET_ONE_FREE,
//     QUANTITY_DISCOUNT,
//     BUNDLE
// }
    
export type ProductPricing = {
    productCode: string,
    config: {
        price: number,
        // offerType?: OfferType, // not currently used
        quantityDiscountThreshold?: number,
        quantityDiscountPrice?: number
        // productBundle?: string[] // N x from these product codes, M x from these product codes etc
    }
}

export class PricingConfig extends Map {}

export interface Offer {
    isAvailable(productCode: string): boolean

    calculate(productCode: string, quantity: number): number
}

export class RegularPrice implements Offer {
    pricingConfig: PricingConfig

    constructor(pricingConfig: PricingConfig) {
        if (!pricingConfig) {
            throw new Error('no pricing config supplied')
        }

        this.pricingConfig = pricingConfig
    }

    isAvailable(productCode: string): boolean {
        if (!productCode) { throw new Error('no productCode supplied') }

        return this.pricingConfig.has(productCode)
    }

    validateCalculateParams(productCode: string, quantity: number) {
        if (!productCode) { throw new Error('no productCode supplied') }
        if (quantity === undefined) { throw new Error('no quantity supplied') }
        if(quantity === 0) { throw new Error('quantity cannot be zero') }
    }

    calculate(productCode: string, quantity: number): number {
        this.validateCalculateParams(productCode, quantity)

        if (this.isAvailable(productCode)) {
            return this.pricingConfig.get(productCode)['price'] * quantity
        }
        
        throw new Error(`No Discount is not available for productCode: ${productCode}`)
    }
}

export class BuyOneGetOneFree extends RegularPrice implements Offer {
    calculate(productCode: string, quantity: number): number {
        this.validateCalculateParams(productCode, quantity)

        if (quantity == 1) {
            return super.calculate(productCode, quantity)
        }

        if ((quantity % 2) == 0) {
            return super.calculate(productCode, (quantity / 2))
        }

        if ((quantity % 2) == 1) {
            return super.calculate(productCode, ((quantity - 1) / 2)) + super.calculate(productCode, 1)
        }

        // Should never get here. Should probably throw an error. e.g. quantity might have a fractional component
    }
}

export class QuantityDiscount extends RegularPrice implements Offer {
    calculate(productCode: string, quantity: number): number {
        this.validateCalculateParams(productCode, quantity)

        if (!this.isAvailable(productCode)) {
            throw new Error(`Quantity Discount is not available for productCode: ${productCode}`)
        }

        if (quantity >= this.pricingConfig.get(productCode)['quantityDiscountThreshold']) {
            return quantity * this.pricingConfig.get(productCode)['quantityDiscountPrice']
        }

        return quantity * this.pricingConfig.get(productCode)['price']
    }
}

/* This will need more complex pricing config, to allow for::
** - N (probably 1) from a set of product codes
** - N (probably 1) from another set of product codes
** - etc
*/
// class MultipleProductsFixedPrice extends RegularPrice implements Offer {}
