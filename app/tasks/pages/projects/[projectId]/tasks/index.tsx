import React, { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, usePaginatedQuery, useRouter, useParam, BlitzPage } from "blitz"
import getTasks from "app/tasks/queries/getTasks"

const ITEMS_PER_PAGE = 100

export const TasksList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: { project: { id: projectId } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <Link
              href="/projects/[projectId]/tasks/[taskId]"
              as={`/projects/${projectId}/tasks/${task.id}`}
            >
              <a>{task.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const TasksPage: BlitzPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <div>
      <p>
        <Link href="/projects/projectId/tasks/new" as={`/projects/${projectId}/tasks/new`}>
          <a>Create Task</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <TasksList />
      </Suspense>
    </div>
  )
}

TasksPage.getLayout = (page) => <Layout title={"Tasks"}>{page}</Layout>

export default TasksPage
