import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const notebookId = searchParams.get('notebookId');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const searchCondition = {
      OR: [
        { content: { contains: query, mode: 'insensitive' as const } },
        { notebook: { title: { contains: query, mode: 'insensitive' as const } } },
        { notebook: { subject: { contains: query, mode: 'insensitive' as const } } },
      ],
    };

    const pages = await prisma.page.findMany({
      where: {
        notebook: {
          userId: session.user.id,
          ...(notebookId ? { id: notebookId } : {}),
        },
        ...searchCondition,
      },
      include: {
        notebook: {
          select: {
            id: true,
            title: true,
            subject: true,
          },
        },
      },
      take: 20,
      orderBy: { updatedAt: 'desc' },
    });

    const results = pages.map((page: {
      id: string;
      pageNumber: number;
      content: string;
      notebook: { id: string; title: string; subject: string };
    }) => ({
      id: page.id,
      pageNumber: page.pageNumber,
      content: page.content.substring(0, 200) + (page.content.length > 200 ? '...' : ''),
      notebookId: page.notebook.id,
      notebookTitle: page.notebook.title,
      notebookSubject: page.notebook.subject,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
