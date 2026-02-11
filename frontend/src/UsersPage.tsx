import UserTable from './components/users/UserTable'
import { useUsers } from './hooks/useUsers'

export default function UsersPage() {
  const {
    users,
    loading,
    search,
    page,
    total,
    limit,
    pages,
    editingId,
    editData,
    handleUpdate,
    handleDelete,
    handleImport,
    handleExportExcel,
    handleExportPDF,
    handleSearch,
    handlePrint,
    handlePagination,
    setEditingId,
    setEditData,
  } = useUsers()

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <UserTable
          users={users}
          loading={loading}
          search={search}
          page={page}
          total={total}
          limit={limit}
          pages={pages}
          editingId={editingId}
          editData={editData}
          onSearch={handleSearch}
          onPrint={handlePrint}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onImport={handleImport}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onPagination={handlePagination}
          onSetEditingId={setEditingId}
          onSetEditData={setEditData}
        />
      </div>
    </div>
  )
}
