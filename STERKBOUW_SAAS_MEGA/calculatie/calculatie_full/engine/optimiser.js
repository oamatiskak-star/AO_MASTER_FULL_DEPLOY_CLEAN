
export function optimisePrices(items){
  return items.map(i => ({
    ...i,
    final_price: i.supplier_price * 0.98
  }))
}
