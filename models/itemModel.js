export default class ProductModel{
    constructor(id,product,quantity,price) {
        this._id = id;
        this._product = product;
        this._quantity = quantity;
        this._price = price;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get product() {
        return this._product;
    }

    set product(value) {
        this._product = value;
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(value) {
        this._quantity = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }
}