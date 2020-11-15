import { Ctx } from "blitz"
import db, { TaskCreateArgs } from "db"

type CreateTaskInput = Pick<TaskCreateArgs, "data">
export default async function createTask({ data }: CreateTaskInput, ctx: Ctx) {
  ctx.session.authorize()

  const task = await db.task.create({ data })

  return task
}
