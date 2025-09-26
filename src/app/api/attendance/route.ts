import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const sessionId = searchParams.get('sessionId')

    if (studentId) {
      // Get student's attendance history
      const attendance = await db.attendance.findMany({
        where: { studentId },
        include: {
          session: {
            include: {
              class: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json(attendance)
    } else if (sessionId) {
      // Get attendance for a specific session
      const attendance = await db.attendance.findMany({
        where: { sessionId },
        include: {
          student: true
        }
      })

      return NextResponse.json(attendance)
    } else {
      return NextResponse.json(
        { error: 'Student ID or Session ID is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Get attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, studentId, status, method, confidence } = await request.json()

    if (!sessionId || !studentId || !status) {
      return NextResponse.json(
        { error: 'Session ID, Student ID, and status are required' },
        { status: 400 }
      )
    }

    // Check if attendance record already exists
    const existingAttendance = await db.attendance.findUnique({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId
        }
      }
    })

    let attendance

    if (existingAttendance) {
      // Update existing record
      attendance = await db.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          status,
          method: method || 'MANUAL',
          confidence,
          checkInTime: status !== 'ABSENT' ? new Date() : null
        }
      })
    } else {
      // Create new record
      attendance = await db.attendance.create({
        data: {
          sessionId,
          studentId,
          status,
          method: method || 'MANUAL',
          confidence,
          checkInTime: status !== 'ABSENT' ? new Date() : null
        }
      })
    }

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Create/update attendance error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}