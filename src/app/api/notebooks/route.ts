import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubjectCoverImage } from '@/lib/unsplash';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notebooks = await prisma.notebook.findMany({
      where: { userId: session.user.id },
      include: {
        pages: {
          orderBy: { pageNumber: 'asc' },
          include: { summary: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(notebooks);
  } catch (error) {
    console.error('Error fetching notebooks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, subject } = await request.json();

    if (!title || !subject) {
      return NextResponse.json(
        { error: 'Title and subject are required' },
        { status: 400 }
      );
    }

    // Fetch cover image from Unsplash
    const coverImage = await getSubjectCoverImage(subject);

    const notebook = await prisma.notebook.create({
      data: {
        title,
        subject,
        coverImage,
        userId: session.user.id,
        pages: {
          create: Array.from({ length: 100 }, (_, i) => ({
            pageNumber: i + 1,
            content: i === 0 ? `# ${title}\n\n**Subject:** ${subject}\n\nThis notebook is dedicated to ${subject}.` : '',
            date: new Date(),
          })),
        },
      },
      include: {
        pages: {
          orderBy: { pageNumber: 'asc' },
          include: { summary: true },
        },
      },
    });

    return NextResponse.json(notebook);
  } catch (error) {
    console.error('Error creating notebook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
