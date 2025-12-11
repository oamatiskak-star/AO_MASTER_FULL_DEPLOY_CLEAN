
export function fixedPriceEngine(stabuItems, supplierPrices){
  const result = []

  for(const item of stabuItems){
    const supplier = supplierPrices[item.code] || item.base_price

    result.push({
      code: item.code,
      description: item.description,
      unit: item.unit,
      base_price: item.base_price,
      supplier_price: supplier,
      final_price: supplier
    })
  }

  return result
}
