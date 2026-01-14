'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { enrollInCourse } from '@/app/actions/enrollment'
import { Button } from '@/components/ui/button'

export function EnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEnroll = async () => {
    setIsEnrolling(true)
    setError(null)

    try {
      await enrollInCourse(courseId)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll')
      alert(error)
    } finally {
      setIsEnrolling(false)
    }
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={isEnrolling}
      className="flex-1"
    >
      {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
    </Button>
  )
}

