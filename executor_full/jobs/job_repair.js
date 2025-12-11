const backendCheck = require("../lib/backendVerify")
const frontendLink = require("../lib/frontendLink")
const supaLink = require("../lib/supabaseLink")

module.exports = {
  name: "job_repair",

  run: async (log) => {
    try {
      log("REPAIR gestart")

      await backendCheck.fix(log)
      await frontendLink.link(log)
      await supaLink.sync(log)

      log("REPAIR voltooid")
      return true

    } catch (err) {
      log("REPAIR fout: " + err.toString())
      return false
    }
  }
}
