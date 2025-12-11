
export async function calculate(req,res){
  const { materials, labor } = req.body
  const total = (materials || 0) + (labor || 0)
  res.json({ total })
}
