import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pageId, content } = await request.json();

    if (!pageId || !content) {
      return NextResponse.json(
        { error: 'Page ID and content are required' },
        { status: 400 }
      );
    }

    // Verify page belongs to user
    const page = await prisma.page.findFirst({
      where: { id: pageId },
      include: { notebook: true },
    });

    if (!page || page.notebook.userId !== session.user.id) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    let bullets: string[];

    try {
      // Try OpenAI first
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes notes into concise bullet points. Return only the bullet points, one per line, starting each with a dash (-).',
          },
          {
            role: 'user',
            content: `Please summarize the following notes into 3-5 key bullet points:\n\n${content}`,
          },
        ],
        max_tokens: 500,
      });

      const summaryText = completion.choices[0]?.message?.content || '';
      bullets = summaryText
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.trim().replace(/^-\s*/, ''));
    } catch {
      // Fallback to extractive summary
      bullets = extractiveSummary(content);
    }

    // Save or update summary
    const summary = await prisma.summary.upsert({
      where: { pageId },
      update: { bullets },
      create: {
        pageId,
        bullets,
      },
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error summarizing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractiveSummary(content: string): string[] {
  // Simple extractive summary fallback
  const sentences = content
    .replace(/[#*_`~]/g, '') // Remove markdown
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  // Get first 5 sentences as bullet points
  return sentences.slice(0, 5);
}
