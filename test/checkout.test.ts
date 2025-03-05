import { Checkout } from '../src/checkout'
import { DiscountCalculator } from '../src/calculator'
import { RegularPrice } from '../src/pricing'

import { standardPricingConfig } from './fixtures/standard-prices'

describe('Constructor()', () => {
    it('throws exception when no DiscounterCalculator supplied', () => {
        expect(() => new Checkout())
            .toThrowError('no DiscountCalculator supplied')
    })

    it('stores the pricing config and initialises a basket', () => {
        const calculator = new DiscountCalculator(standardPricingConfig)
        const checkout = new Checkout(calculator)

        expect(checkout.calculator).toStrictEqual(calculator)
        expect(checkout.basket).toStrictEqual(new Map())
        expect(checkout.total()).toBe(0)
    })
})

describe('scan()', () => {
    it('throws error if not productCode supplied', () => {
        expect(() => new Checkout(standardPricingConfig).scan())
            .toThrowError('no productCode supplied')
    })

    it('it increments counter for number of supplied product code in basket', () => {
        const checkout = new Checkout(standardPricingConfig)

        expect(checkout.basket.has('CF1')).toBeFalsy()

        checkout.scan('CF1')
        expect(checkout.basket.get('CF1')).toBe(1)
        
        checkout.scan('CF1')
        expect(checkout.basket.get('CF1')).toBe(2)

        checkout.scan('FR1')
        expect(checkout.basket.get('FR1')).toBe(1)
        expect(checkout.basket.get('CF1')).toBe(2)
        expect(checkout.basket.has('SR1')).toBeFalsy()
    })
})

describe('total()', () => {
    it('can total a single non-discounted item', () => {
        const checkout = new Checkout(new DiscountCalculator([new RegularPrice(standardPricingConfig)]))
    
        checkout.scan('CF1')
    
        expect(checkout.total()).toBe(11.23)
    })
    
    it('can add multiple non-discounted items', () => {
        const checkout = new Checkout(new DiscountCalculator([new RegularPrice(standardPricingConfig)]))
    
        checkout.scan('CF1')
        checkout.scan('CF1')
        expect(checkout.total()).toBe(22.46)

        checkout.scan('CF1')
        expect(checkout.total()).toBe(33.69)
    })

    it('can add multiple single items', () => {
        const checkout = new Checkout(new DiscountCalculator([new RegularPrice(standardPricingConfig)]))
    
        checkout.scan('FR1')
        expect(checkout.total()).toBe(3.11)

        checkout.scan('SR1')
        expect(checkout.total()).toBe(8.11)

        checkout.scan('CF1')
        expect(checkout.total()).toBe(19.34)
    })
})
