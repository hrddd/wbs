import { Ctx, NotFoundError } from "blitz"
import db, { FindFirstTaskArgs } from "db"

type GetTaskInput = Pick<FindFirstTaskArgs, "where">

export default async function getTask({ where }: GetTaskInput, ctx: Ctx) {
  ctx.session.authorize()

  const task = await db.task.findFirst({ where })

  if (!task) throw new NotFoundError()

  return task
}
