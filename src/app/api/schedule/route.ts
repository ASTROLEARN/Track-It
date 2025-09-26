import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const whereClause: any = { userId }
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const scheduleItems = await db.scheduleItem.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        skills: {
          include: {
            skill: true
          }
        },
        careerGoals: true
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    return NextResponse.json(scheduleItems)
  } catch (error) {
    console.error('Error fetching schedule items:', error)
    return NextResponse.json({ error: 'Failed to fetch schedule items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      userId,
      title,
      description,
      date,
      startTime,
      endTime,
      type,
      priority = 'MEDIUM',
      location,
      notes,
      reminders
    } = data

    if (!userId || !title || !date || !startTime || !endTime || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const scheduleItem = await db.scheduleItem.create({
      data: {
        userId,
        title,
        description,
        date: new Date(date),
        startTime: new Date(`${date}T${startTime}`),
        endTime: new Date(`${date}T${endTime}`),
        type,
        priority,
        location,
        notes,
        reminders: reminders ? JSON.stringify(reminders) : null
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(scheduleItem, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule item:', error)
    return NextResponse.json({ error: 'Failed to create schedule item' }, { status: 500 })
  }
}