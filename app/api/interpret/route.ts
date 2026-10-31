import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: '服务器未配置 OPENAI_API_KEY' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { chart, question } = body;

    if (!chart) {
      return NextResponse.json(
        { error: '缺少命盘数据' },
        { status: 400 }
      );
    }

    const userQuestion =
      typeof question === 'string' && question.trim()
        ? question.trim()
        : '请综合解读这张紫微斗数命盘。';

    const prompt = `
你是一名紫微斗数文化研究与解读助手。

请基于用户提供的命盘数据进行分析。

要求：
1. 使用简体中文。
2. 先讲结论，再解释依据。
3. 不要只罗列星曜，要把星曜、宫位、四化和结构联系起来。
4. 表达通俗，让没有紫微斗数基础的人也能看懂。
5. 明确区分“传统命理体系中的解释”和确定的现实事实。
6. 不要宣称能够确定预测未来。
7. 不要用恐吓性语言，不要把疾病、死亡、灾祸等描述成必然事件。
8. 涉及事业、财富、感情等问题时，以趋势、性格倾向、决策启发的方式表达。
9. 如果命盘数据不足以支持某个结论，要明确说明。
10. 默认回答控制在约 800～1500 个中文字；如果用户只是追问一个具体问题，可以更精炼。

用户的问题：
${userQuestion}

命盘数据：
${JSON.stringify(chart)}
`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-6-luna',
        input: prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            'AI 解读服务暂时不可用，请稍后再试',
        },
        { status: response.status }
      );
    }

    const text =
      data.output_text ||
      data.output
        ?.flatMap((item: any) => item.content || [])
        ?.find((item: any) => item.type === 'output_text')
        ?.text;

    if (!text) {
      return NextResponse.json(
        { error: 'AI 没有返回有效内容' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      interpretation: text,
    });
  } catch (error) {
    console.error('Interpret API error:', error);

    return NextResponse.json(
      { error: '服务器处理失败，请稍后再试' },
      { status: 500 }
    );
  }
}
