
export async function getProjects(req,res){
  res.json([{ id:1, name:"Project A" }, { id:2, name:"Project B" }])
}
