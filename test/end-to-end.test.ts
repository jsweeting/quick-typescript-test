import { Checkout } from '../src/checkout'
import { DiscountCalculator } from '../src/calculator'
import { PricingConfig, RegularPrice, BuyOneGetOneFree, QuantityDiscount } from '../src/pricing'

import { fr1, sr1, cf1 } from './fixtures/standard-prices'

function getConfiguredCheckout() {
    return new Checkout(new DiscountCalculator([
        new QuantityDiscount(new PricingConfig().set(sr1.productCode, sr1.config)),
        new BuyOneGetOneFree(new PricingConfig().set(fr1.productCode, fr1.config)),
        new     RegularPrice(new PricingConfig().set(cf1.productCode, cf1.config))
    ]))
}

describe('End to End Test', () => {
    test('Basket 1', () => {
        const checkout = getConfiguredCheckout()

        checkout.scan('FR1')
        checkout.scan('SR1')
        checkout.scan('FR1')
        checkout.scan('FR1')
        checkout.scan('CF1')

        expect(checkout.total()).toBe(22.45)
    })

    test('Basket 2', () => {
        const checkout = getConfiguredCheckout()
        
        checkout.scan('FR1')
        checkout.scan('FR1')
        
        expect(checkout.total()).toBe(3.11)
    })
    
    test('Basket 3', () => {
        const checkout = getConfiguredCheckout()

        checkout.scan('SR1')
        checkout.scan('SR1')
        checkout.scan('FR1')
        checkout.scan('SR1')

        expect(checkout.total()).toBe(16.61)
    })
})
