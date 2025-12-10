import express from "express"
import { supabase } from "../supabaseClient.js"

const router = express.Router()

router.post("/apply", async (req,res) => {
const { version_id, factor, user_id } = req.body

const { data: lines } = await supabase
.from("calc_lines")
.select("*")
.eq("version_id", version_id)

for (const line of lines) {
if (line.categorie >= 1 && line.categorie <= 3) {
const newVal = Number(line.inkoop_prijs) * factor

  await supabase.from("calc_pricing_log").insert({
    calc_line_id: line.id,
    old_price: line.inkoop_prijs,
    new_price: newVal,
    source: "fixedprice",
    user_id
  })

  await supabase
    .from("calc_lines")
    .update({
      inkoop_prijs: newVal,
      verkoop_prijs: newVal,
      materiaal_prijs: newVal
    })
    .eq("id", line.id)
}


}

res.json({ status:"ok" })
})

export default router
