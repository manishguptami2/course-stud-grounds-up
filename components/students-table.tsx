'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createStudent, updateStudent, deleteStudent } from '@/app/actions/student'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type Student = {
  id: string
  name: string
  email: string
  createdAt: Date
  _count: {
    enrollments: number
    quizAttempts: number
  }
}

export function StudentsTable({ students }: { students: Student[] }) {
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const form = e.currentTarget

    try {
      await createStudent(new FormData(form))
      form.reset()
      setIsAddDialogOpen(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create student')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingStudent) return
    
    setIsSubmitting(true)
    setError(null)
    const form = e.currentTarget

    try {
      await updateStudent(editingStudent.id, new FormData(form))
      setEditingStudent(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return
    }

    try {
      await deleteStudent(studentId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete student')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Create a new student account. The student will be able to log in with these credentials.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateStudent}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="student-name">Name *</Label>
                  <Input
                    id="student-name"
                    name="name"
                    required
                    placeholder="Student name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="student-email">Email *</Label>
                  <Input
                    id="student-email"
                    name="email"
                    type="email"
                    required
                    placeholder="student@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="student-password">Password *</Label>
                  <Input
                    id="student-password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter password"
                    className="mt-1"
                  />
                </div>
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Student'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No students yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first student
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Student
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead>Quiz Attempts</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student._count.enrollments}</TableCell>
                  <TableCell>{student._count.quizAttempts}</TableCell>
                  <TableCell>
                    {new Date(student.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={editingStudent?.id === student.id}
                        onOpenChange={(open) => {
                          if (!open) setEditingStudent(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingStudent(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Student</DialogTitle>
                            <DialogDescription>
                              Update student information. Leave password blank to keep the current password.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleUpdateStudent}>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="edit-student-name">Name *</Label>
                                <Input
                                  id="edit-student-name"
                                  name="name"
                                  defaultValue={student.name}
                                  required
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-student-email">Email *</Label>
                                <Input
                                  id="edit-student-email"
                                  name="email"
                                  type="email"
                                  defaultValue={student.email}
                                  required
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-student-password">New Password</Label>
                                <Input
                                  id="edit-student-password"
                                  name="password"
                                  type="password"
                                  placeholder="Leave blank to keep current password"
                                  className="mt-1"
                                />
                              </div>
                              {error && (
                                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                  {error}
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingStudent(null)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Student'}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}


