import React from 'react'
import TaskList from './components/tasks/TaskList'
import { useTasks } from './hooks/useTasks'

export default function TasksPage() {
  const {
    tasks,
    loading,
    editingId,
    editingTitle,
    title,
    setTitle,
    setEditingTitle,
    addTask,
    removeTask,
    toggleTaskComplete,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useTasks()

  return (
    <TaskList
      tasks={tasks}
      loading={loading}
      title={title}
      editingId={editingId}
      editingTitle={editingTitle}
      onTitleChange={setTitle}
      onAddTask={addTask}
      onToggleComplete={toggleTaskComplete}
      onStartEdit={startEdit}
      onSaveEdit={saveEdit}
      onCancelEdit={cancelEdit}
      onEditingTitleChange={setEditingTitle}
      onRemoveTask={removeTask}
    />
  )
}
