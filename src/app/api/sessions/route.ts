import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')

    if (!classId) {
      return NextResponse.json(
        { error: 'Class ID is required' },
        { status: 400 }
      )
    }

    const sessions = await db.attendanceSession.findMany({
      where: { classId },
      include: {
        _count: {
          select: { attendance: true }
        },
        class: {
          include: {
            students: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    // Calculate attendance counts for each session
    const sessionsWithCounts = sessions.map(session => ({
      ...session,
      presentCount: session._count.attendance,
      totalCount: session.class.students.length
    }))

    return NextResponse.json(sessionsWithCounts)
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { classId, startTime, endTime } = await request.json()

    if (!classId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Class ID, start time, and end time are required' },
        { status: 400 }
      )
    }

    const session = await db.attendanceSession.create({
      data: {
        classId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        date: new Date()
      }
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Create session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}