import { Ctx } from "blitz"
import db, { TaskDeleteArgs } from "db"

type DeleteTaskInput = Pick<TaskDeleteArgs, "where">

export default async function deleteTask({ where }: DeleteTaskInput, ctx: Ctx) {
  ctx.session.authorize()

  const task = await db.task.delete({ where })

  return task
}
