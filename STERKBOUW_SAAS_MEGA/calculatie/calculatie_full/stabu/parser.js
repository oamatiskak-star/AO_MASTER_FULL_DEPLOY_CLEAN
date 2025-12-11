
import fs from 'fs'

export function parseSTABU(filePath){
  const raw = fs.readFileSync(filePath,'utf8')
  const lines = raw.split('\n')
  const items = []

  for(const line of lines){
    if(!line.trim()) continue
    const [code, description, unit, price] = line.split(';')
    items.push({
      code: code.trim(),
      description: description.trim(),
      unit: unit.trim(),
      base_price: parseFloat(price)
    })
  }

  return items
}
