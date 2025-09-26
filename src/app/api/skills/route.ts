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
      whereClause.skill = { category }
    }

    const userSkills = await db.userSkill.findMany({
      where: whereClause,
      include: {
        skill: true,
        milestones: {
          orderBy: { targetLevel: 'asc' }
        },
        recommendations: {
          where: { dismissed: false },
          orderBy: { priority: 'desc' }
        }
      },
      orderBy: {
        level: 'desc'
      }
    })

    return NextResponse.json(userSkills)
  } catch (error) {
    console.error('Error fetching user skills:', error)
    return NextResponse.json({ error: 'Failed to fetch user skills' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { userId, skillId, targetLevel = 100 } = data

    if (!userId || !skillId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if skill exists, create if not
    let skill = await db.skill.findUnique({
      where: { id: skillId }
    })

    if (!skill) {
      // Create a basic skill entry
      skill = await db.skill.create({
        data: {
          id: skillId,
          name: skillId, // Use the ID as name for now
          category: 'TECHNICAL' // Default category
        }
      })
    }

    // Check if user already has this skill
    const existingUserSkill = await db.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      }
    })

    if (existingUserSkill) {
      return NextResponse.json(existingUserSkill, { status: 200 })
    }

    const userSkill = await db.userSkill.create({
      data: {
        userId,
        skillId,
        targetLevel
      },
      include: {
        skill: true
      }
    })

    return NextResponse.json(userSkill, { status: 201 })
  } catch (error) {
    console.error('Error creating user skill:', error)
    return NextResponse.json({ error: 'Failed to create user skill' }, { status: 500 })
  }
}