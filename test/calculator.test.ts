import { RegularPrice, Offer } from "../src/pricing"
import { DiscountCalculator } from "../src/calculator"

import { standardPricingConfig } from './fixtures/standard-prices'

describe('DiscountCalculator.constructor()', () => {
    it('throws exception when no pricing config supplied', () => {
        expect(() => new DiscountCalculator())
            .toThrowError('no offerCalculators supplied')
    })

    it('stores the offer calculators config', () => {
        const testOfferCalculators = [
            new RegularPrice(standardPricingConfig)
        ]

        const calc = new DiscountCalculator(testOfferCalculators)

        expect(calc.offerCalculators).toStrictEqual(testOfferCalculators)
    })
})

describe('DiscountCalculator.calculate()', () => {
    it('throws error if no calculators are configured for supplied productCode', () =>{
        const calcOne: Offer = {
            isAvailable: vi.fn().mockReturnValue(false),
            calculate: vi.fn()
        }

        const calcTwo: Offer = {
            isAvailable: vi.fn().mockReturnValue(false),
            calculate: vi.fn()
        }
        const calcThree: Offer = {
            isAvailable: vi.fn().mockReturnValue(false),
            calculate: vi.fn()
        }

        expect(() => new DiscountCalculator([calcOne, calcTwo, calcThree]).calculate('PROD', 2))
            .toThrow('no calculators configured for productCode: PROD')

    })

    it('iterates over each of the supplied offer calculators, returning the calculation of the first that has an offer available', () => {
        const calcOne: Offer = {
            isAvailable: vi.fn().mockReturnValue(false),
            calculate: vi.fn()
        }

        const calcTwo: Offer = {
            isAvailable: vi.fn().mockReturnValue(true),
            calculate: vi.fn().mockReturnValue(42)
        }
        const calcThree: Offer = {
            isAvailable: vi.fn().mockReturnValue(false),
            calculate: vi.fn()
        }

        const calc = new DiscountCalculator([calcOne, calcTwo, calcThree])

        const result = calc.calculate('PRODUCT', 3)

        expect(calcOne.isAvailable).toHaveBeenCalledTimes(1)
        expect(calcOne.calculate).not.toHaveBeenCalled()

        expect(calcTwo.isAvailable).toHaveBeenCalledTimes(1)
        expect(calcTwo.calculate).toHaveBeenCalledExactlyOnceWith('PRODUCT', 3)

        expect(calcThree.isAvailable).not.toHaveBeenCalled()
        expect(calcThree.calculate).not.toHaveBeenCalled()

        expect(result).toBe(42)
    })
})