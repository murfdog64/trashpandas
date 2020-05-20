export default class Item {
  constructor(type, name) {
    const vaildTypes = ['bread', 'meat', 'condiment', 'greens', 'veggies', 'cheese']
    if (!vaildTypes.includes(type)) {
      throw ('INVALID TYPE:', type);
    }
    this.type = type;
    this.name = name;
  }
}