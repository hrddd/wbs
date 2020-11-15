import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import getTask from "app/tasks/queries/getTask"
import updateTask from "app/tasks/mutations/updateTask"
import TaskForm from "app/tasks/components/TaskForm"

export const EditTask = () => {
  const router = useRouter()
  const taskId = useParam("taskId", "number")
  const [task, { mutate }] = useQuery(getTask, { where: { id: taskId } })
  const [updateTaskMutation] = useMutation(updateTask)

  return (
    <div>
      <h1>Edit Task {task.id}</h1>
      <pre>{JSON.stringify(task)}</pre>

      <TaskForm
        initialValues={task}
        onSubmit={async () => {
          try {
            const updated = await updateTaskMutation({
              where: { id: task.id },
              data: { name: "MyNewName" },
            })
            await mutate(updated)
            alert("Success!" + JSON.stringify(updated))
            router.push("/tasks/[taskId]", `/tasks/${updated.id}`)
          } catch (error) {
            console.log(error)
            alert("Error creating task " + JSON.stringify(error, null, 2))
          }
        }}
      />
    </div>
  )
}

const EditTaskPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTask />
      </Suspense>

      <p>
        <Link href="/tasks">
          <a>Tasks</a>
        </Link>
      </p>
    </div>
  )
}

EditTaskPage.getLayout = (page) => <Layout title={"Edit Task"}>{page}</Layout>

export default EditTaskPage
