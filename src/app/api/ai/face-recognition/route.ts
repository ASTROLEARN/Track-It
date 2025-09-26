import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { imageData, sessionId } = await request.json()

    if (!imageData || !sessionId) {
      return NextResponse.json(
        { error: 'Image data and session ID are required' },
        { status: 400 }
      )
    }

    // Get the session details
    const session = await db.attendanceSession.findUnique({
      where: { id: sessionId },
      include: {
        class: {
          include: {
            students: {
              include: {
                student: true
              }
            }
          }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Use AI to analyze the face and identify the student
    const analysisPrompt = `
    Analyze this facial recognition image data for an attendance system.
    The image contains a student's face for attendance check-in.
    
    Please:
    1. Identify if this is a clear, frontal face image suitable for recognition
    2. Estimate the confidence level of the recognition (0-100)
    3. Provide a brief analysis of the image quality
    
    Return your response as a JSON object with the following structure:
    {
      "isFaceDetected": true/false,
      "confidence": 0-100,
      "quality": "good/fair/poor",
      "analysis": "brief description of the analysis"
    }
    `

    // Simulate AI analysis (in a real implementation, you would send the actual image data)
    const mockAnalysis = {
      isFaceDetected: true,
      confidence: 94.2,
      quality: "good",
      analysis: "Clear frontal face image with good lighting and contrast"
    }

    // For demo purposes, we'll use mock data
    // In a real implementation, you would use the ZAI SDK to analyze the actual image
    // const completion = await zai.chat.completions.create({
    //   messages: [
    //     {
    //       role: 'system',
    //       content: analysisPrompt
    //     },
    //     {
    //       role: 'user',
    //       content: `Image data: ${imageData}`
    //     }
    //   ]
    // })

    // const analysis = JSON.parse(completion.choices[0].message.content)

    const analysis = mockAnalysis

    if (!analysis.isFaceDetected) {
      return NextResponse.json(
        { 
          error: 'No face detected in image',
          analysis 
        },
        { status: 400 }
      )
    }

    // For demo purposes, we'll randomly select a student from the class
    // In a real implementation, you would use the AI to match the face against student photos
    const students = session.class.students
    const randomClassStudent = students[Math.floor(Math.random() * students.length)]

    if (!randomClassStudent) {
      return NextResponse.json(
        { error: 'No students found in class' },
        { status: 404 }
      )
    }

    const randomStudent = randomClassStudent.student

    // Create or update attendance record
    const attendance = await db.attendance.upsert({
      where: {
        sessionId_studentId: {
          sessionId,
          studentId: randomStudent.id
        }
      },
      update: {
        status: 'PRESENT',
        method: 'FACIAL_RECOGNITION',
        confidence: analysis.confidence,
        checkInTime: new Date()
      },
      create: {
        sessionId,
        studentId: randomStudent.id,
        status: 'PRESENT',
        method: 'FACIAL_RECOGNITION',
        confidence: analysis.confidence,
        checkInTime: new Date()
      }
    })

    // Update session with AI analysis
    await db.attendanceSession.update({
      where: { id: sessionId },
      data: {
        aiAnalysis: JSON.stringify(analysis)
      }
    })

    return NextResponse.json({
      success: true,
      attendance,
      student: {
        id: randomStudent.id,
        name: randomStudent.name,
        email: randomStudent.email
      },
      analysis
    })

  } catch (error) {
    console.error('Face recognition error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}