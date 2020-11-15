import React from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import createTask from "app/tasks/mutations/createTask"
import TaskForm from "app/tasks/components/TaskForm"

const NewTaskPage: BlitzPage = () => {
  const router = useRouter()
  const [createTaskMutation] = useMutation(createTask)

  return (
    <div>
      <h1>Create New Task</h1>

      <TaskForm
        initialValues={{}}
        onSubmit={async () => {
          try {
            const task = await createTaskMutation({ data: { name: "MyName" } })
            alert("Success!" + JSON.stringify(task))
            router.push("/tasks/[taskId]", `/tasks/${task.id}`)
          } catch (error) {
            alert("Error creating task " + JSON.stringify(error, null, 2))
          }
        }}
      />

      <p>
        <Link href="/tasks">
          <a>Tasks</a>
        </Link>
      </p>
    </div>
  )
}

NewTaskPage.getLayout = (page) => <Layout title={"Create New Task"}>{page}</Layout>

export default NewTaskPage
