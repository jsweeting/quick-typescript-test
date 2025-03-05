import { PricingConfig, RegularPrice } from "../src/pricing"

import { standardPricingConfig } from './fixtures/standard-prices'

describe('constructor()', () => {
    it('throws exception when no pricing config supplied', () => {
        expect(() => new RegularPrice())
            .toThrowError('no pricing config supplied')
    })

    it('stores the pricing config', () => {
        const calc = new RegularPrice(standardPricingConfig)

        expect(calc.pricingConfig).toStrictEqual(standardPricingConfig)
    })
})

describe('isAvailable()', () => {
    it('throws error if no productCode supplied', () => {
        expect(() => new RegularPrice(standardPricingConfig).isAvailable())
            .toThrowError('no productCode supplied')
    })

    it('returns false when productCode not contained in pricingConfig', () => {
        expect(new RegularPrice(new PricingConfig()).isAvailable('CF1')).toBeFalsy()
    })

    it('returns true when productCode not contained in pricingConfig', () => {
        expect(new RegularPrice(standardPricingConfig).isAvailable('CF1')).toBeTruthy()
    })
})

describe('calculate()', () => {
    it('throws error if no productCode supplied', () => {
        expect(() => new RegularPrice(new PricingConfig()).calculate())
            .toThrowError('no productCode supplied')
    })

    it('throws error if no quantity supplied', () => {
        expect(() => new RegularPrice(standardPricingConfig).calculate('CF1'))
            .toThrowError('no quantity supplied')
    })

    it('throws error if quantity is zero', () => {
        expect(() => new RegularPrice(standardPricingConfig).calculate('CF1', 0))
            .toThrowError('quantity cannot be zero')
    })

    it('throws error when offer is not available for supplied productCode', () => {
        expect(() => new RegularPrice(new PricingConfig()).calculate('CF1', 20)).toThrowError('No Discount is not available for productCode: CF1')
    })

    it('performs a basic quantity x price calculation and returns the result', () => {
        const calc = new RegularPrice(standardPricingConfig)

        expect(calc.calculate('CF1', 1)).toBe(11.23)
        expect(calc.calculate('CF1', 2)).toBe(22.46)
        expect(calc.calculate('CF1', 3)).toBe(33.69)
    })
})