import { sendTask } from "../lib/api"

export default function TaskButton({ label, task }) {
  return (
    <button
      onClick={async () => {
        const r = await sendTask(task)
        console.log("Task resultaat:", r)
      }}
    >
      {label}
    </button>
  )
}
