import React from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, useParam, BlitzPage } from "blitz"
import createTask from "app/tasks/mutations/createTask"
import TaskForm from "app/tasks/components/TaskForm"

const NewTaskPage: BlitzPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createTaskMutation] = useMutation(createTask)
  return (
    <div>
      <h1>Create New Task</h1>

      <TaskForm
        initialValues={{}}
        onSubmit={async () => {
          try {
            console.log({ data: { name: "MyName" }, projectId })
            const task = await createTaskMutation({ data: { name: "MyName" }, projectId })
            alert("Success!" + JSON.stringify(task))
            router.push(
              "/projects/[projectId]/tasks/[taskId]",
              `/projects/${projectId}/tasks/${task.id}`
            )
          } catch (error) {
            alert("Error creating task " + JSON.stringify(error, null, 2))
          }
        }}
      />

      <p>
        <Link as="/projects/projectId/tasks" href={`/projects/${projectId}/tasks`}>
          <a>Tasks</a>
        </Link>
      </p>
    </div>
  )
}

NewTaskPage.getLayout = (page) => <Layout title={"Create New Task"}>{page}</Layout>

export default NewTaskPage
