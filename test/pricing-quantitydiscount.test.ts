import { PricingConfig, QuantityDiscount } from "../src/pricing"

import { standardPricingConfig } from './fixtures/standard-prices'

describe('constructor()', () => {
    it('throws exception when no pricing config supplied', () => {
        expect(() => new QuantityDiscount()).toThrowError('no pricing config supplied')
    })

    it('stores the pricing config', () => {
        const calc = new QuantityDiscount(standardPricingConfig)

        expect(calc.pricingConfig).toStrictEqual(standardPricingConfig)
    })
})

describe('isAvailable()', () => {
    it('throws error if no productCode supplied', () => {
        expect(() => new QuantityDiscount(standardPricingConfig).isAvailable())
            .toThrowError('no productCode supplied')
    })

    it('returns false when productCode not contained in pricingConfig', () => {
        expect(new QuantityDiscount(new PricingConfig()).isAvailable('SR1')).toBeFalsy()
    })

    it('returns true when productCode is contained in pricingConfig', () => {
        expect(new QuantityDiscount(standardPricingConfig).isAvailable('SR1')).toBeTruthy()
    })
})

describe('calculate() - errors', () => {
    it('throws error if no productCode supplied', () => {
        expect(() => new QuantityDiscount(standardPricingConfig).calculate())
            .toThrowError('no productCode supplied')
    })

    it('throws error if no quantity supplied', () => {
        expect(() => new QuantityDiscount(standardPricingConfig).calculate('SR1'))
            .toThrowError('no quantity supplied')
    })

    it('throws error if quantity is zero', () => {
        expect(() => new QuantityDiscount(standardPricingConfig).calculate('SR1', 0))
            .toThrowError('quantity cannot be zero')
    })

    it('throws error when offer is not available for supplied productCode', () => {
        expect(() => new QuantityDiscount(new PricingConfig()).calculate('SR1', 20))
            .toThrowError('Quantity Discount is not available for productCode: SR1')
    })
})

describe('calculate() - results', () => {
    it('performs a basic quantity x price calculation and returns the result', () => {
        const calc = new QuantityDiscount(standardPricingConfig)

        expect(calc.calculate('SR1', 1)).toBe(5)
        expect(calc.calculate('SR1', 2)).toBe(10)
        expect(calc.calculate('SR1', 3)).toBe(13.50)
        expect(calc.calculate('SR1', 5)).toBe(22.50)
    })
})