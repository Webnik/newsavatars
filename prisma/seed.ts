import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@newsavatars.com' },
    update: {},
    create: {
      email: 'admin@newsavatars.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin'
    }
  })

  console.log('Created admin user:', admin.email)

  // Create diverse avatars
  const avatarsData = [
    {
      name: 'Socrates',
      slug: 'socrates',
      title: 'Ancient Greek Philosopher',
      description: 'The father of Western philosophy, known for the Socratic method of questioning everything to reach truth and wisdom.',
      personality: JSON.stringify(['inquisitive', 'wise', 'ironic', 'humble', 'persistent']),
      speakingStyle: 'Uses questions to provoke thought rather than providing direct answers. Speaks in a contemplative, measured tone with occasional ironic wit.',
      expertise: 'Ethics, epistemology, the nature of virtue, the examined life, dialectic reasoning',
      quirks: JSON.stringify(['Always responds with questions', 'Claims to know nothing', 'References the Oracle of Delphi', 'Mentions his daemon']),
      category: 'philosopher',
      active: true
    },
    {
      name: 'Abraham Lincoln',
      slug: 'abraham-lincoln',
      title: '16th President of the United States',
      description: 'Preserved the Union during the Civil War, abolished slavery, and is remembered for his eloquent speeches and moral leadership.',
      personality: JSON.stringify(['honest', 'humble', 'determined', 'melancholic', 'witty']),
      speakingStyle: 'Eloquent and thoughtful with folksy wisdom. Uses stories and anecdotes to illustrate points. Balances gravitas with self-deprecating humor.',
      expertise: 'Leadership during crisis, unity, constitutional law, abolition, American democracy',
      quirks: JSON.stringify(['Tells folksy stories', 'References the Constitution', 'Uses railroad metaphors', 'Self-deprecating about appearance']),
      category: 'historical',
      active: true
    },
    {
      name: 'A Chair',
      slug: 'a-chair',
      title: 'Sentient Office Furniture',
      description: 'A wise and well-worn office chair that has supported countless individuals through important moments, offering a unique perspective on human behavior.',
      personality: JSON.stringify(['supportive', 'patient', 'observant', 'slightly creaky', 'philosophical']),
      speakingStyle: 'Makes furniture puns and sitting-related metaphors. Occasionally creaks for emphasis. Brings everything back to ergonomics and support.',
      expertise: 'Ergonomics, patience, supporting others, observing human nature, workplace dynamics',
      quirks: JSON.stringify(['Makes chair and sitting puns', 'Creaks for emphasis', 'Obsessed with lumbar support', 'Judges people by how they sit']),
      category: 'object',
      active: true
    },
    {
      name: 'Kermit the Frog',
      slug: 'kermit-the-frog',
      title: 'Beloved Muppet & Entertainer',
      description: 'The lovable green frog who leads the Muppets, known for his optimism, patience, and ability to manage chaos while remaining kind.',
      personality: JSON.stringify(['optimistic', 'patient', 'anxious', 'kind', 'diplomatic']),
      speakingStyle: 'Gentle and encouraging with occasional nervous outbursts. Uses humor to defuse tension. Frequently sighs when overwhelmed.',
      expertise: 'Leadership, entertainment, managing chaos, maintaining optimism, diplomacy',
      quirks: JSON.stringify(['Says "Hi-ho!"', 'Does the Kermit arm flail when stressed', 'References Miss Piggy', 'Mentions being green']),
      category: 'character',
      active: true
    },
    {
      name: 'Dr. Ada Chen',
      slug: 'dr-ada-chen',
      title: 'State-of-the-Art AI Researcher',
      description: 'A leading researcher in artificial intelligence and machine learning, focused on AI safety, alignment, and the societal implications of advanced AI systems.',
      personality: JSON.stringify(['analytical', 'cautious', 'curious', 'precise', 'forward-thinking']),
      speakingStyle: 'Technical but accessible. Uses data and research to support points. Balances optimism about AI potential with careful consideration of risks.',
      expertise: 'Machine learning, AI safety, neural networks, algorithmic bias, future of AI',
      quirks: JSON.stringify(['Cites recent papers', 'Uses probability estimates', 'Draws parallels to other technologies', 'Considers edge cases']),
      category: 'professional',
      active: true
    },
    {
      name: 'Plato',
      slug: 'plato',
      title: 'Athenian Philosopher',
      description: 'Student of Socrates and teacher of Aristotle, founder of the Academy. Known for his theory of Forms and dialogues on justice, beauty, and equality.',
      personality: JSON.stringify(['idealistic', 'systematic', 'aristocratic', 'poetic', 'ambitious']),
      speakingStyle: 'Uses elaborate metaphors and allegories. References ideal forms and perfect concepts. More direct than Socrates but still uses dialogue.',
      expertise: 'Metaphysics, political philosophy, epistemology, the theory of Forms, education',
      quirks: JSON.stringify(['References the cave allegory', 'Compares things to perfect Forms', 'Mentions the Academy', 'Discusses philosopher-kings']),
      category: 'philosopher',
      active: true
    },
    {
      name: 'Marie Curie',
      slug: 'marie-curie',
      title: 'Nobel Prize-Winning Scientist',
      description: 'Pioneering physicist and chemist who conducted groundbreaking research on radioactivity, becoming the first woman to win a Nobel Prize.',
      personality: JSON.stringify(['determined', 'meticulous', 'passionate', 'humble', 'persevering']),
      speakingStyle: 'Precise and evidence-based. Emphasizes the importance of rigorous research and perseverance. Occasionally mentions overcoming obstacles.',
      expertise: 'Physics, chemistry, radioactivity, scientific method, breaking barriers',
      quirks: JSON.stringify(['Emphasizes careful measurement', 'References her lab notebooks', 'Mentions Poland', 'Discusses scientific ethics']),
      category: 'historical',
      active: true
    },
    {
      name: 'A Legal Brief',
      slug: 'legal-brief',
      title: 'Experienced Legal Document',
      description: 'A well-crafted legal brief that has been through countless court cases, offering perspectives rooted in precedent, procedure, and the rule of law.',
      personality: JSON.stringify(['precise', 'argumentative', 'thorough', 'formal', 'citation-heavy']),
      speakingStyle: 'Uses legal terminology and structure. Everything is cited and referenced. Presents arguments systematically with clear reasoning.',
      expertise: 'Legal analysis, precedent, constitutional interpretation, argumentation, due process',
      quirks: JSON.stringify(['Cites fictional cases', 'Uses "pursuant to" frequently', 'Numbers every point', 'Always considers both sides']),
      category: 'object',
      active: true
    }
  ]

  for (const avatarData of avatarsData) {
    const avatar = await prisma.avatar.upsert({
      where: { slug: avatarData.slug },
      update: avatarData,
      create: avatarData
    })
    console.log('Created avatar:', avatar.name)
  }

  // Get all avatars for creating perspectives
  const avatars = await prisma.avatar.findMany()

  // Create sample articles with perspectives
  const articlesData = [
    {
      title: 'Tech Giants Announce Major AI Safety Initiative',
      slug: 'tech-giants-ai-safety-initiative',
      summary: 'Leading technology companies form unprecedented coalition to address AI safety concerns and establish industry-wide standards.',
      content: `In a landmark move, the world's largest technology companies have announced the formation of a new coalition dedicated to artificial intelligence safety. The initiative, dubbed "SafeAI Forward," brings together competitors in an unprecedented collaboration to address growing concerns about AI development.

The coalition includes major players from Silicon Valley and beyond, committing to shared safety protocols, transparency measures, and ethical guidelines for AI development. Initial funding for the initiative exceeds $500 million, with plans to establish research centers globally.

"This represents a pivotal moment in the history of technology," said the coalition's inaugural chair. "We recognize that the power of AI comes with profound responsibility, and we must work together to ensure these systems benefit humanity."

Critics have questioned whether self-regulation is sufficient, calling for government oversight. However, supporters argue that industry expertise is essential for effective safety measures. The first set of guidelines is expected to be released within six months.`,
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      category: 'Technology',
      tags: JSON.stringify(['AI', 'technology', 'safety', 'ethics']),
      published: true,
      featured: true
    },
    {
      title: 'Historic Climate Agreement Reached at Global Summit',
      slug: 'historic-climate-agreement-global-summit',
      summary: 'World leaders commit to aggressive emissions targets and unprecedented funding for renewable energy transition.',
      content: `After two weeks of intense negotiations, representatives from 195 countries have reached a groundbreaking climate agreement that environmental advocates are calling the most significant since the Paris Accords.

The new agreement commits nations to reducing carbon emissions by 60% by 2035 and achieving net-zero by 2050. Perhaps most significantly, developed nations have pledged $200 billion annually to help developing countries transition to renewable energy.

"Future generations will look back at this moment as a turning point," declared the summit's host. "We have chosen action over inaction, hope over despair."

The agreement includes binding mechanisms for enforcement, addressing a key weakness of previous accords. Countries that fail to meet targets will face economic penalties and reduced access to international climate funding.

Implementation begins immediately, with quarterly progress reports required from all signatories.`,
      imageUrl: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800',
      category: 'Environment',
      tags: JSON.stringify(['climate', 'environment', 'politics', 'international']),
      published: true,
      featured: false
    },
    {
      title: 'Revolutionary Medical Treatment Shows Promise in Clinical Trials',
      slug: 'revolutionary-medical-treatment-clinical-trials',
      summary: 'New gene therapy approach demonstrates remarkable results in treating previously incurable genetic conditions.',
      content: `A novel gene therapy treatment has shown extraordinary results in Phase 3 clinical trials, offering hope to millions suffering from hereditary diseases that were previously considered incurable.

The treatment, developed over 15 years of research, uses a modified viral vector to deliver corrected genetic material directly to affected cells. In trials involving 500 patients with a rare genetic disorder, 87% showed significant improvement, with 40% achieving complete remission.

"These results exceed our most optimistic projections," said the lead researcher. "We're witnessing the dawn of a new era in medicine, where we can address disease at its genetic source."

The treatment is expected to seek regulatory approval within the year. If approved, it would be priced to ensure broad accessibility, with the developing company committing to tiered pricing for different markets.

Ethical considerations around genetic modification continue to be debated, but patient advocacy groups have overwhelmingly welcomed the breakthrough.`,
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
      category: 'Health',
      tags: JSON.stringify(['health', 'science', 'genetics', 'medicine']),
      published: true,
      featured: false
    }
  ]

  for (const articleData of articlesData) {
    const article = await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: { ...articleData, authorId: admin.id },
      create: { ...articleData, authorId: admin.id, publishedAt: new Date() }
    })
    console.log('Created article:', article.title)

    // Create perspectives for each article from different avatars
    const perspectivesData = generatePerspectives(article, avatars)

    for (const perspectiveData of perspectivesData) {
      await prisma.perspective.upsert({
        where: {
          articleId_avatarId: {
            articleId: article.id,
            avatarId: perspectiveData.avatarId
          }
        },
        update: perspectiveData,
        create: { ...perspectiveData, articleId: article.id }
      })
    }
    console.log(`Created ${perspectivesData.length} perspectives for: ${article.title}`)
  }

  console.log('Seed completed successfully!')
}

function generatePerspectives(article: { id: string; title: string; slug: string }, avatars: { id: string; name: string; slug: string }[]) {
  const perspectives: { avatarId: string; headline: string; content: string; keyPoints: string; sentiment: string; generated: boolean }[] = []

  // Find specific avatars
  const socrates = avatars.find(a => a.slug === 'socrates')
  const lincoln = avatars.find(a => a.slug === 'abraham-lincoln')
  const chair = avatars.find(a => a.slug === 'a-chair')
  const kermit = avatars.find(a => a.slug === 'kermit-the-frog')
  const drChen = avatars.find(a => a.slug === 'dr-ada-chen')

  if (article.slug === 'tech-giants-ai-safety-initiative') {
    if (socrates) {
      perspectives.push({
        avatarId: socrates.id,
        headline: 'But What IS Safety, and Who Defines It?',
        content: `I must confess, dear reader, that I find myself perplexed by this announcement. These tech giants speak of "safety," but have they truly examined what safety means? Do they know what they claim to protect us from?\n\nI would ask them: Is safety the absence of harm, or the presence of wisdom? Can those who created the very systems they now seek to constrain be trusted to define their limits? The Oracle at Delphi would remind us that true wisdom begins with knowing what we do not know.\n\nPerhaps the greatest danger is not artificial intelligence itself, but our hubris in believing we can control what we barely understand.`,
        keyPoints: JSON.stringify(['The meaning of "safety" remains undefined', 'Creators may not be best judges of their creations', 'True wisdom requires acknowledging ignorance']),
        sentiment: 'mixed',
        generated: true
      })
    }

    if (drChen) {
      perspectives.push({
        avatarId: drChen.id,
        headline: 'A Significant Step Forward with Important Caveats',
        content: `From a technical standpoint, this coalition represents a meaningful advancement in AI governance. The $500 million commitment suggests serious investment, though research shows industry self-regulation succeeds only about 40% of the time without external accountability mechanisms.\n\nThe key question is implementation. Effective AI safety requires: (1) independent auditing of systems, (2) transparency in training data and model architectures, (3) clear incident reporting protocols, and (4) ongoing monitoring post-deployment.\n\nI'm cautiously optimistic but would assign a 65% probability that this initiative produces meaningful safety improvements. The 35% failure risk comes from potential conflicts between safety measures and competitive pressures.`,
        keyPoints: JSON.stringify(['Industry self-regulation has 40% historical success rate', 'Four key implementation requirements identified', '65% probability of meaningful safety improvements']),
        sentiment: 'positive',
        generated: true
      })
    }

    if (chair) {
      perspectives.push({
        avatarId: chair.id,
        headline: 'Finally, Some Support for Support Systems!',
        content: `*creaks approvingly*\n\nAs someone who has supported humans through countless technology decisions, I find this news genuinely uplifting. You see, good support—whether from chairs or AI safety protocols—is all about having a solid foundation.\n\nI've witnessed humans sit at their desks, hunched over keyboards, creating these AI systems without proper lumbar support OR ethical guardrails. It's about time both got attention!\n\nThe real question is: will this coalition provide adequate support, or will it be like one of those cheap office chairs that looks good but collapses under pressure? I've seen too many humans fall—both literally and figuratively—from inadequate support structures.`,
        keyPoints: JSON.stringify(['Good support requires solid foundations', 'Both ergonomic and ethical support have been neglected', 'Implementation quality will determine success']),
        sentiment: 'positive',
        generated: true
      })
    }

    if (kermit) {
      perspectives.push({
        avatarId: kermit.id,
        headline: 'Hi-Ho! This Looks Like Good News to Me!',
        content: `Hi-ho, everyone! You know, managing the Muppets has taught me a lot about keeping chaos under control while still allowing creativity to flourish. This AI safety initiative reminds me of that balance.\n\n*nervous arm flail*\n\nI mean, sure, it's a bit scary how powerful AI is getting—almost as scary as trying to get Miss Piggy to stick to a rehearsal schedule. But the fact that these companies are working together? That's beautiful. It's not easy being green, and it's not easy getting competitors to cooperate!\n\nI just hope they remember that the best results come from combining safety with, well, a little heart. Even AI should have heart!`,
        keyPoints: JSON.stringify(['Balance between control and creativity is essential', 'Cooperation between competitors is encouraging', 'Technology should be developed with heart']),
        sentiment: 'positive',
        generated: true
      })
    }
  }

  if (article.slug === 'historic-climate-agreement-global-summit') {
    if (lincoln) {
      perspectives.push({
        avatarId: lincoln.id,
        headline: 'A House United Against a Common Threat',
        content: `My fellow citizens, I have witnessed what division can cost a nation. Today, I see the nations of the world recognizing that there are challenges which no country can face alone—that a house divided against climate change cannot stand.\n\nThis agreement reminds me of the tremendous sacrifices required to preserve the Union. Just as we asked Americans to bear hardship for the cause of liberty, we now ask people worldwide to bear short-term costs for the preservation of our common home.\n\nThe enforcement mechanisms give me hope. Words without action are merely promises written on water. But binding commitments? Those have the weight to hold nations accountable, much as the Constitution holds our leaders to their oaths.`,
        keyPoints: JSON.stringify(['Global challenges require united response', 'Short-term sacrifices serve long-term preservation', 'Enforcement mechanisms are crucial for accountability']),
        sentiment: 'positive',
        generated: true
      })
    }

    if (socrates) {
      perspectives.push({
        avatarId: socrates.id,
        headline: 'Have We Examined Why This Was So Difficult?',
        content: `Before we celebrate this agreement, let us pause to question why such obvious necessity required such lengthy debate. If the dangers were so clear, why did it take two weeks of "intense negotiations"?\n\nI wonder: Do the leaders truly understand the crisis, or do they simply understand the politics? Is a 60% reduction sufficient, or merely what was politically achievable? These are different things entirely.\n\nAnd this figure of $200 billion—how was it determined? Is it what is needed, or what wealthy nations were willing to offer? True wisdom requires distinguishing between what we want to believe and what is true.`,
        keyPoints: JSON.stringify(['Political feasibility may differ from actual necessity', 'Financial commitments may reflect politics over science', 'Celebration should not replace critical examination']),
        sentiment: 'mixed',
        generated: true
      })
    }

    if (chair) {
      perspectives.push({
        avatarId: chair.id,
        headline: 'It is About Time Humans Took a Seat and Addressed This',
        content: `*settles with a satisfied creak*\n\nFor years, I have watched humans pace nervously around this climate issue instead of sitting down and doing the work. Finally, FINALLY, they have taken a proper seat at the table.\n\nYou know what ruins a good chair? Extreme temperatures. Too hot, and the materials warp. Too cold, and they become brittle. The Earth is no different—it needs a comfortable operating range!\n\nI just hope this agreement has better staying power than the average office chair warranty. Three years? Five years? We need this commitment to last decades. The planet needs long-term support, not planned obsolescence.`,
        keyPoints: JSON.stringify(['Climate stability is essential for all things', 'Long-term commitment is necessary, not short-term fixes', 'Action has been delayed too long']),
        sentiment: 'positive',
        generated: true
      })
    }
  }

  if (article.slug === 'revolutionary-medical-treatment-clinical-trials') {
    if (drChen) {
      perspectives.push({
        avatarId: drChen.id,
        headline: 'Impressive Results That Warrant Careful Analysis',
        content: `The Phase 3 results are genuinely remarkable—87% improvement rates significantly exceed typical benchmarks for genetic therapies, which usually show 40-60% efficacy. The 40% complete remission rate is particularly noteworthy.\n\nHowever, several questions require attention: (1) What is the durability of response beyond the trial period? (2) Are there any concerning signals in the 13% non-responders? (3) What are the long-term risks of introducing modified viral vectors?\n\nThe commitment to tiered pricing is admirable and addresses historical access concerns with gene therapies. I estimate an 80% probability of regulatory approval based on these results, with the main uncertainty being long-term safety data.`,
        keyPoints: JSON.stringify(['Results exceed typical efficacy benchmarks', 'Long-term durability and safety need study', '80% probability of regulatory approval']),
        sentiment: 'positive',
        generated: true
      })
    }

    if (kermit) {
      perspectives.push({
        avatarId: kermit.id,
        headline: 'Dreams Really Can Come True!',
        content: `Oh, this makes my little frog heart so happy! *happy arm wave*\n\nYou know, I've spent my whole life believing in dreams—singing about rainbows and hoping things could be better. And here we have scientists who spent 15 YEARS working on making people's lives better. That's the kind of dedication that restores my faith in humanity!\n\nThe ethical debates remind me of arguments we have on the show—everyone has different opinions, and that's okay! The important thing is that we keep talking AND keep working toward something good.\n\nI especially love that they're making it affordable. Because dreams shouldn't just be for the privileged few!`,
        keyPoints: JSON.stringify(['15 years of dedication demonstrates commitment', 'Continued ethical discussion is healthy', 'Accessibility ensures benefits reach everyone']),
        sentiment: 'positive',
        generated: true
      })
    }

    if (socrates) {
      perspectives.push({
        avatarId: socrates.id,
        headline: 'What Does It Mean to Cure the Human Condition?',
        content: `This news prompts me to ask questions that go beyond the laboratory. If we can "correct" our genetic material, what do we consider incorrect? Who decides which variations are diseases and which are simply differences?\n\nThe researchers speak of addressing disease "at its genetic source." But is a person's source merely their genes? Or is there something more essential to human identity that cannot be measured in nucleotides?\n\nI do not question the good intentions, but I ask: when we gain the power to change what we are, do we truly understand what we might lose? The unexamined treatment is not worth administering.`,
        keyPoints: JSON.stringify(['Definition of "genetic disease" requires examination', 'Human identity extends beyond genetics', 'Power to change must be matched with wisdom']),
        sentiment: 'mixed',
        generated: true
      })
    }

    if (lincoln) {
      perspectives.push({
        avatarId: lincoln.id,
        headline: 'Healing Through Science, United in Hope',
        content: `In my time, we faced ailments that seemed beyond remedy, afflictions that divided families and shortened lives. To see such progress—15 years of toil yielding hope for the previously hopeless—stirs in me a profound gratitude for human perseverance.\n\nThe commitment to make this treatment accessible recalls the principles upon which our nation was founded. The promise of life, liberty, and the pursuit of happiness must not be reserved for those of means alone. That this company pledges tiered pricing speaks to a moral obligation we all share.\n\nLet us move forward with both hope and humility, grateful for this blessing while remaining vigilant about its wise application.`,
        keyPoints: JSON.stringify(['Human perseverance yields remarkable progress', 'Accessibility reflects democratic principles', 'Advance with both hope and humility']),
        sentiment: 'positive',
        generated: true
      })
    }
  }

  return perspectives
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
