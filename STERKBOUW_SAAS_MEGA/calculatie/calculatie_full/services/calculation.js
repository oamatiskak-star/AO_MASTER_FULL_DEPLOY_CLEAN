
import { fixedPriceEngine } from "../engine/fixedPriceEngine.js"
import { optimisePrices } from "../engine/optimiser.js"
import { parseSTABU } from "../stabu/parser.js"

export function runCalculation(stabuPath, supplierMap){
  const stabu = parseSTABU(stabuPath)
  const withSupplier = fixedPriceEngine(stabu, supplierMap)
  const optimised = optimisePrices(withSupplier)

  let total = 0
  for(const line of optimised){
    total += line.final_price
  }

  return { lines: optimised, total }
}
