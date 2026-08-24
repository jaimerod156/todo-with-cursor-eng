'use client'

import { FormEvent, useMemo, useState } from 'react'
import {
  Check,
  CheckCircle2,
  Circle,
  ListTodo,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

 type Task = {
  id: number
  title: string
  completed: boolean
}

const initialTasks: Task[] = [
  // { id: 1, title: 'Map out the week ahead', completed: true },
  // { id: 2, title: 'Reply to important emails', completed: false },
  // { id: 3, title: 'Pick up groceries for dinner', completed: false },
]

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const remainingCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks],
  )

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newTask.trim()
    if (!title) return

    setTasks((current) => [
      ...current,
      { id: Date.now(), title, completed: false },
    ])
    setNewTask('')
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function startEditing(task: Task) {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  function saveTask(id: number) {
    const title = editingTitle.trim()
    if (!title) return

    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, title } : task)),
    )
    setEditingId(null)
    setEditingTitle('')
  }

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id))
    if (editingId === id) setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ListTodo aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Daily desk
              </p>
              <h1 className="text-xl font-semibold tracking-tight">My tasks</h1>
            </div>
          </div>
          <span className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
            {remainingCount} {remainingCount === 1 ? 'left' : 'left'}
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14">
        <section className="flex flex-col gap-2">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-primary">
            Focus, one thing at a time
          </p>
          <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Make space for what matters.
          </h2>
          <p className="max-w-lg text-base leading-6 text-muted-foreground">
            Keep today&apos;s priorities close, clear, and easy to finish.
          </p>
        </section>

        <section className="flex flex-col gap-4" aria-labelledby="task-list-heading">
          <form onSubmit={addTask} className="flex gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
            <label htmlFor="new-task" className="sr-only">Add a new task</label>
            <input
              id="new-task"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="What needs to get done?"
              className="min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" size="lg" className="rounded-xl px-4">
              <Plus data-icon="inline-start" />
              <span className="hidden sm:inline">Add task</span>
              <span className="sr-only sm:hidden">Add task</span>
            </Button>
          </form>

          <div className="flex items-center justify-between px-1">
            <h2 id="task-list-heading" className="text-sm font-semibold">Your list</h2>
            <p className="text-sm text-muted-foreground">{tasks.length} total</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                <CheckCircle2 className="text-primary" aria-hidden="true" />
                <p className="font-medium">A clear desk is a good feeling.</p>
                <p className="text-sm text-muted-foreground">Add a task above to get started.</p>
              </div>
            ) : (
              <ul>
                {tasks.map((task, index) => (
                  <li key={task.id} className={`flex items-center gap-3 px-4 py-4 sm:px-5 ${index > 0 ? 'border-t border-border' : ''}`}>
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
                      className="shrink-0 rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {task.completed ? <CheckCircle2 className="text-primary" aria-hidden="true" /> : <Circle aria-hidden="true" />}
                    </button>

                    {editingId === task.id ? (
                      <input
                        autoFocus
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.nativeEvent.isComposing || event.keyCode === 229) return
                          if (event.key === 'Enter') saveTask(task.id)
                          if (event.key === 'Escape') setEditingId(null)
                        }}
                        aria-label="Edit task"
                        className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    ) : (
                      <span className={`min-w-0 flex-1 text-sm sm:text-base ${task.completed ? 'text-muted-foreground line-through' : ''}`}>
                        {task.title}
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      {editingId === task.id ? (
                        <>
                          <Button type="button" size="icon-sm" variant="ghost" onClick={() => saveTask(task.id)} aria-label="Save task">
                            <Check data-icon="inline-start" />
                          </Button>
                          <Button type="button" size="icon-sm" variant="ghost" onClick={() => setEditingId(null)} aria-label="Cancel editing">
                            <X data-icon="inline-start" />
                          </Button>
                        </>
                      ) : (
                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => startEditing(task)} aria-label={`Edit ${task.title}`}>
                          <Pencil data-icon="inline-start" />
                        </Button>
                      )}
                      <Button type="button" size="icon-sm" variant="ghost" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`}>
                        <Trash2 data-icon="inline-start" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 text-sm text-muted-foreground sm:px-8">
          <span>Small steps, steady progress.</span>
          <span className="font-mono text-xs uppercase tracking-[0.16em]">Todo / 01</span>
        </div>
      </footer>
    </div>
  )
}
