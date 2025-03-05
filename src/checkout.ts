export class Checkout {
    calculator
    basket: Map<string,number>

    constructor(discountCalculator) {
        if (!discountCalculator) { throw new Error('no DiscountCalculator supplied') }

        this.calculator = discountCalculator
        this.basket = new Map()
    }

    scan(productCode) {
        if (!productCode) { throw new Error('no productCode supplied') }

        this.basket.set(productCode, this.basket.has(productCode) ? this.basket.get(productCode) + 1 : 1
        )
    }

    total() {
        let checkoutTotal = 0

        this.basket.forEach( (quantity, productCode) => {
            checkoutTotal+= this.calculator.calculate(productCode, quantity)
        })

        return checkoutTotal
    }
}
