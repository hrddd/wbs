import { Ctx } from "blitz"
import db, { TaskUpdateArgs } from "db"

type UpdateTaskInput = Pick<TaskUpdateArgs, "where" | "data">

export default async function updateTask({ where, data }: UpdateTaskInput, ctx: Ctx) {
  ctx.session.authorize()

  const task = await db.task.update({ where, data })

  return task
}
