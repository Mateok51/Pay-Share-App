//Defining how the data is going to look like
class ItemModel {
  constructor(
    id,
    name,
    ps4,
    ps5,
    owner,
    background_image,
    reservations,
    price,
    ps4History,
    ps5History,
    note
  ) {
    this.id = id
    this.name = name
    this.ps4 = ps4
    this.ps5 = ps5
    this.owner = owner
    this.background_image = background_image
    this.reservations = reservations
    this.price = price
    this.ps4History = ps4History
    this.ps5History = ps5History
    this.note = note
  }
}

export default ItemModel
