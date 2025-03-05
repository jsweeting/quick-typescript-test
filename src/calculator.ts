export class DiscountCalculator {
    offerCalculators

    constructor(offerCalculators: object[]) {
        if (!offerCalculators) {
            throw new Error('no offerCalculators supplied')
        }

        this.offerCalculators = offerCalculators
    }

    calculate(productCode: string, quantity: number) {
        for(const offer of this.offerCalculators) {
            if (offer.isAvailable(productCode)) {
                return offer.calculate(productCode, quantity)
            }
        }

        throw new Error(`no calculators configured for productCode: ${productCode}`)
    }
}
