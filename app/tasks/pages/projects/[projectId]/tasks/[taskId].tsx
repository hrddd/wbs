import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getTask from "app/tasks/queries/getTask"
import deleteTask from "app/tasks/mutations/deleteTask"

export const Task = () => {
  const router = useRouter()
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")
  const [task] = useQuery(getTask, { where: { id: taskId } })
  const [deleteTaskMutation] = useMutation(deleteTask)

  return (
    <div>
      <h1>Task {task.id}</h1>
      <pre>{JSON.stringify(task, null, 2)}</pre>

      <Link
        href="/projects/[projectId]/tasks/[taskId]/edit"
        as={`/projects/${projectId}/tasks/${task.id}/edit`}
      >
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteTaskMutation({ where: { id: task.id } })
            router.push("/projects/[projectId]/tasks", `/projects/${projectId}/tasks`)
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

const ShowTaskPage: BlitzPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <div>
      <p>
        <Link href="/projects/projectId/tasks" as={`/projects/${projectId}/tasks`}>
          <a>Tasks</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Task />
      </Suspense>
    </div>
  )
}

ShowTaskPage.getLayout = (page) => <Layout title={"Task"}>{page}</Layout>

export default ShowTaskPage
