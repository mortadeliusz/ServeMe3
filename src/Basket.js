function Basket(rid) {
  this.rid = rid;
  this.items = [];
  this.update = function (item, quantity) {
    if (this.items.filter((el) => el.id === item.id).length > 0) {
      this.items.filter((el) => el.id === item.id)[0].qty = quantity;
    } else this.items.push({ ...item, qty: quantity });
    this.items = [...this.items.filter((item) => item.qty > 0)];
  };
}
export default Basket;
