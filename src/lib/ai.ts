import OpenAI from 'openai'

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

interface Avatar {
  name: string
  title: string
  personality: string
  speakingStyle: string
  expertise: string
  quirks: string
}

interface Article {
  title: string
  content: string
  category: string
}

export async function generatePerspective(
  avatar: Avatar,
  article: Article
): Promise<{
  headline: string
  content: string
  keyPoints: string[]
  sentiment: string
}> {
  const personality = JSON.parse(avatar.personality)
  const quirks = JSON.parse(avatar.quirks)

  const systemPrompt = `You are ${avatar.name}, ${avatar.title}.

Your personality traits: ${personality.join(', ')}
Your speaking style: ${avatar.speakingStyle}
Your areas of expertise: ${avatar.expertise}
Your quirks and unique characteristics: ${quirks.join(', ')}

You will analyze news articles and provide your unique perspective based on who you are. Stay completely in character. Your analysis should reflect your worldview, expertise, and personality quirks.`

  const userPrompt = `Please analyze this news article and provide your unique perspective:

Title: ${article.title}
Category: ${article.category}

Content:
${article.content}

Provide your response in the following JSON format:
{
  "headline": "Your catchy headline for this take (in your voice)",
  "content": "Your full analysis (2-3 paragraphs, in your voice and perspective)",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "sentiment": "positive|negative|neutral|mixed"
}`

  try {
    const openai = getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')

    return {
      headline: result.headline || `${avatar.name}'s Take`,
      content: result.content || 'No analysis available.',
      keyPoints: result.keyPoints || [],
      sentiment: result.sentiment || 'neutral'
    }
  } catch (error) {
    console.error('Error generating perspective:', error)

    // Return a fallback response
    return {
      headline: `${avatar.name} is Currently Unavailable`,
      content: `${avatar.name} is taking a moment to gather their thoughts on this matter. Please check back later for their unique perspective.`,
      keyPoints: ['Analysis pending'],
      sentiment: 'neutral'
    }
  }
}

// Demo mode for when no API key is available
export async function generateDemoPerspective(
  avatar: Avatar,
  article: Article
): Promise<{
  headline: string
  content: string
  keyPoints: string[]
  sentiment: string
}> {
  const personality = JSON.parse(avatar.personality)

  // Generate a mock perspective based on avatar type
  const perspectives: Record<string, () => { headline: string; content: string; keyPoints: string[]; sentiment: string }> = {
    'Socrates': () => ({
      headline: `But What IS "${article.title.split(' ').slice(0, 3).join(' ')}"?`,
      content: `I must confess, dear reader, that upon examining this matter of "${article.title}", I find myself knowing only that I know nothing. Let us question the very foundations of this news. What do we truly mean when we speak of these events? Have we examined our assumptions?\n\nThe youth of Athens would benefit greatly from contemplating such matters, for in questioning everything, we approach wisdom. I wonder: does this article reveal truth, or merely opinion dressed as fact?`,
      keyPoints: [
        'We must question our fundamental assumptions',
        'True wisdom lies in recognizing our ignorance',
        'The examined life requires deeper analysis'
      ],
      sentiment: 'neutral'
    }),
    'Abraham Lincoln': () => ({
      headline: `A House Divided: ${article.title.split(' ').slice(0, 4).join(' ')}`,
      content: `My fellow citizens, as I consider the matters presented in "${article.title}", I am reminded that we cannot escape history. The events we witness today will be judged by future generations.\n\nWith malice toward none and charity for all, we must approach this news with both wisdom and compassion. Let us bind up the wounds of division and move forward as one nation, indivisible.`,
      keyPoints: [
        'Unity remains essential to our progress',
        'History will judge our responses',
        'Compassion must guide our analysis'
      ],
      sentiment: 'mixed'
    }),
    'A Chair': () => ({
      headline: `Finally, Someone Sits Down to Address: ${article.title.split(' ').slice(0, 3).join(' ')}`,
      content: `*creaks thoughtfully*\n\nAs a chair, I've supported countless individuals through important moments, and this news about "${article.title}" really has me feeling stressed. I mean, do humans ever just sit down and think about the REAL issues? Like lumbar support?\n\nI've been in this room for years, silently observing. And let me tell you, if people would just take a seat and reflect more often, we'd have fewer of these headlines.`,
      keyPoints: [
        'People need to sit down more often',
        'Stability is underrated in modern discourse',
        'Four legs good, standing all day bad'
      ],
      sentiment: 'mixed'
    }),
    'default': () => ({
      headline: `${avatar.name}'s Perspective on ${article.title.split(' ').slice(0, 4).join(' ')}`,
      content: `As ${avatar.name}, ${avatar.title}, I approach this news with my unique viewpoint. The matter of "${article.title}" demands careful consideration through the lens of ${personality[0] || 'my experience'}.\n\nDrawing upon my expertise in ${avatar.expertise}, I believe this development carries significant implications that deserve further examination and discussion.`,
      keyPoints: [
        `Viewed through ${personality[0] || 'expert'} lens`,
        'Requires careful consideration',
        'Has broader implications'
      ],
      sentiment: 'neutral'
    })
  }

  const generator = perspectives[avatar.name] || perspectives['default']
  return generator()
}
