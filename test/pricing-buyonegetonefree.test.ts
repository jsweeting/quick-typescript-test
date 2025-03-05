import { PricingConfig, BuyOneGetOneFree } from "../src/pricing"

import { standardPricingConfig } from './fixtures/standard-prices'

describe('constructor()', () => {
    it('throws exception when no pricing config supplied', () => {
        expect(() => new BuyOneGetOneFree())
            .toThrowError('no pricing config supplied')
    })

    it('stores the pricing config', () => {
        const calc = new BuyOneGetOneFree(standardPricingConfig)

        expect(calc.pricingConfig).toStrictEqual(standardPricingConfig)
    })
})

describe('isAvailable()', () => {
    it('throws error if no productCode supplied', () => {
        expect(() => new BuyOneGetOneFree(standardPricingConfig).isAvailable())
            .toThrowError('no productCode supplied')
    })

    it('returns false when productCode not contained in pricingConfig', () => {
        expect(new BuyOneGetOneFree(new PricingConfig()).isAvailable('FR1')).toBeFalsy()
    })

    it('returns true when productCode is contained in pricingConfig', () => {
        expect(new BuyOneGetOneFree(standardPricingConfig).isAvailable('FR1')).toBeTruthy()
    })
})

describe('calculate() - errors', () => {
    it('throws error if no productCode supplied', () => {
        expect(() => new BuyOneGetOneFree(standardPricingConfig).calculate())
            .toThrowError('no productCode supplied')
    })

    it('throws error if no quantity supplied', () => {
        expect(() => new BuyOneGetOneFree(standardPricingConfig).calculate('FR1'))
            .toThrowError('no quantity supplied')
    })

    it('throws error if quantity is 0', () => {
        expect(() => new BuyOneGetOneFree(new PricingConfig()).calculate('FR1', 0))
            .toThrowError('quantity cannot be zero')
    })

    it('throws error when offer is not available for supplied productCode', () => {
        expect(() => new BuyOneGetOneFree(new PricingConfig()).calculate('FR1', 2))
            .toThrowError('No Discount is not available for productCode: FR1')
    })
})

describe('calculate() - results', () => {
    it('no discount is applied when quantity is one a single item', () => {
        expect(new BuyOneGetOneFree(standardPricingConfig).calculate('FR1', 1)).toBe(3.11)
    })

    it('the price for two items should be the price for a single item', () => {
        expect(new BuyOneGetOneFree(standardPricingConfig).calculate('FR1', 2)).toBe(3.11)
    })

    it('the price for three items should be the price for two', () => {
        expect(new BuyOneGetOneFree(standardPricingConfig).calculate('FR1', 3)).toBe(6.22)
    })

    it('the price for four items should be the price for two', () => {
        expect(new BuyOneGetOneFree(standardPricingConfig).calculate('FR1', 4)).toBe(6.22)
    })

    it('the price for an even number of items should be the price of half the number of items', () => {
        expect(new BuyOneGetOneFree(standardPricingConfig).calculate('FR1', 42)).toBe(21 * 3.11)
    })

    it('the price for an odd number of items should be the price of one plus half the number of remaining items', () => {
        expect(new BuyOneGetOneFree(standardPricingConfig).calculate('FR1', 43)).toBe(3.11 + (21 * 3.11))
    })
})
