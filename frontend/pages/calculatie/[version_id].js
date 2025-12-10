import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Calc() {
const router = useRouter()
const { version_id } = router.query

const [lines, setLines] = useState([])

async function load() {
if (!version_id) return
const res = await fetch(/api/calc/lines/${version_id})
const data = await res.json()
setLines(data)
}

async function fixedPrice() {
await fetch("/api/fixedprice/apply",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ version_id, factor:0.92 })
})
load()
}

async function afprijzen() {
await fetch("/api/leveranciers/afprijzen",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ version_id })
})
load()
}

useEffect(()=>{ load() }, [version_id])

return (
<div>
<h1>Calculatie</h1>

  <button onClick={fixedPrice}>Fixed Price</button>
  <button onClick={afprijzen}>Afprijzen</button>

  {lines.map(line => (
    <div key={line.id}>
      {line.stabu_code} {line.omschrijving} €{line.inkoop_prijs}
    </div>
  ))}
</div>


)
}
