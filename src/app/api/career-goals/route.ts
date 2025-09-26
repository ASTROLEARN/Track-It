import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const whereClause: any = { userId }
    
    if (category) {
      whereClause.category = category
    }

    const careerGoals = await db.careerGoal.findMany({
      where: whereClause,
      include: {
        milestones: {
          orderBy: { targetDate: 'asc' }
        },
        roadmapSteps: {
          orderBy: { order: 'asc' }
        },
        insights: {
          where: { dismissed: false },
          orderBy: { priority: 'desc' }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { targetDate: 'asc' }
      ]
    })

    return NextResponse.json(careerGoals)
  } catch (error) {
    console.error('Error fetching career goals:', error)
    return NextResponse.json({ error: 'Failed to fetch career goals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      userId,
      title,
      description,
      category,
      targetDate,
      priority = 'MEDIUM',
      salaryRange,
      marketDemand = 'MEDIUM'
    } = data

    if (!userId || !title || !description || !category || !targetDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const careerGoal = await db.careerGoal.create({
      data: {
        userId,
        title,
        description,
        category,
        targetDate: new Date(targetDate),
        priority,
        salaryRange: salaryRange ? JSON.stringify(salaryRange) : null,
        marketDemand
      },
      include: {
        milestones: true,
        roadmapSteps: true,
        insights: true
      }
    })

    return NextResponse.json(careerGoal, { status: 201 })
  } catch (error) {
    console.error('Error creating career goal:', error)
    return NextResponse.json({ error: 'Failed to create career goal' }, { status: 500 })
  }
}