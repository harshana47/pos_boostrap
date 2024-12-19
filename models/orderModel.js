export default class OrderModel{
    constructor(id,customer_id,item_id,quantity,total_price) {
        this._id = id;
        this._customer_id = customer_id;
        this._item_id = item_id;
        this._quantity = quantity;
        this._total_price = total_price;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get customer_id() {
        return this._customer_id;
    }

    set customer_id(value) {
        this._customer_id = value;
    }

    get item_id() {
        return this._item_id;
    }

    set item_id(value) {
        this._item_id = value;
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(value) {
        this._quantity = value;
    }

    get total_price() {
        return this._total_price;
    }

    set total_price(value) {
        this._total_price = value;
    }
}