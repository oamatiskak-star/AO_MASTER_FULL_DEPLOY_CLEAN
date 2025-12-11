import express from "express"
import { supabase } from "../supabaseClient.js"

const router = express.Router()

router.post("/afprijzen", async (req,res) => {
const { version_id, user_id } = req.body

const { data: lines } = await supabase
.from("calc_lines")
.select("*")
.eq("version_id", version_id)

for (const line of lines) {
const { data: artikel } = await supabase
.from("artikel_bestanden")
.select("*")
.eq("artikelcode", line.stabu_code)
.maybeSingle()

if (!artikel) continue

const newPrice = artikel.leverancier_prijs

await supabase.from("calc_pricing_log").insert({
  calc_line_id: line.id,
  old_price: line.inkoop_prijs,
  new_price: newPrice,
  source:"leveranciers",
  user_id
})

await supabase
  .from("calc_lines")
  .update({
    inkoop_prijs: newPrice,
    materiaal_prijs: newPrice
  })
  .eq("id", line.id)


}

res.json({ status:"ok" })
})

export default router
