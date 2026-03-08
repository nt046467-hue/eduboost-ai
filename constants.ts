import { StudyGuide, BlogPost, FAQItem, StudyMaterial } from "./types";

export const STUDY_GUIDES: (StudyGuide & { imageUrl: string })[] = [
  {
    id: "sg-1",
    title: "Mastering Quantum Mechanics",
    subject: "Physics",
    summary:
      "A deep dive into wave-particle duality, Schrödinger equations, and the fundamental principles that govern the subatomic world.",
    difficulty: "Advanced",
    readTime: "45 min",
    imageUrl:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>The Quantum Revolution</h2>
      <p>Quantum Mechanics is the branch of physics that deals with the behavior of matter and energy at the scale of atoms and subatomic particles. It is the foundation of all modern physics, including chemistry, materials science, and electronics.</p>
      
      <div class="my-10 rounded-3xl overflow-hidden border border-[#1a1a1a] shadow-2xl">
        <img src="https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1200" alt="Physics Lab" class="w-full h-80 object-cover grayscale opacity-80" />
      </div>

      <h3>1. Wave-Particle Duality</h3>
      <p>The most famous concept is that every particle may be described as either a particle or a wave. This was famously demonstrated by the double-slit experiment, where electrons (which we think of as particles) created an interference pattern typical of waves.</p>
      
      <h3>2. The Uncertainty Principle</h3>
      <p>Proposed by Werner Heisenberg, this principle states that it is impossible to know both the exact position and the exact momentum of an object at the same time. This isn't a limitation of our measuring instruments, but a fundamental property of the universe.</p>

      <h3>3. Quantum Superposition</h3>
      <p>A quantum system can exist in multiple states simultaneously until it is measured. This is often illustrated by "Schrödinger's Cat," a thought experiment where a cat is both dead and alive inside a box until someone looks inside.</p>

      <h3>4. Applications</h3>
      <p>Without Quantum Mechanics, we wouldn't have transistors, lasers, or MRI machines. The entire digital age is built upon our understanding of how electrons move through silicon, which is governed entirely by quantum laws.</p>
    `,
    quiz: [
      {
        question:
          "What experiment famously demonstrated wave-particle duality?",
        options: [
          "The Michelson-Morley Experiment",
          "The Double-Slit Experiment",
          "The Oil Drop Experiment",
          "The Gold Foil Experiment",
        ],
        correctIndex: 1,
      },
      {
        question: "In the Schrödinger Equation, what does ψ represent?",
        options: [
          "Particle Momentum",
          "Velocity",
          "Wavefunction",
          "Energy level",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "sg-2",
    title: "Organic Chemistry Decoded",
    subject: "Chemistry",
    summary:
      "Simplify complex reaction mechanisms, functional groups, and molecular orbital theory with visual mnemonics.",
    difficulty: "Intermediate",
    readTime: "30 min",
    imageUrl:
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>Foundations of Carbon Life</h2>
      <p>Organic chemistry is the study of carbon-containing compounds. Because carbon can form four stable covalent bonds, it allows for the creation of incredibly complex molecules that are the building blocks of life.</p>
      
      <div class="my-10 rounded-3xl overflow-hidden border border-[#1a1a1a] shadow-2xl">
        <img src="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200" alt="Molecular Model" class="w-full h-80 object-cover grayscale opacity-80" />
      </div>

      <h3>Functional Groups</h3>
      <p>Functional groups are specific groups of atoms within molecules that have their own characteristic properties. Common groups include Hydroxyl (-OH), Carboxyl (-COOH), and Amino (-NH2). Recognizing these is the first step in predicting how a molecule will react.</p>

      <h3>Reaction Mechanisms</h3>
      <p>Understanding organic chemistry isn't about memorizing reactions; it's about understanding <i>how</i> electrons move. Nucleophiles (electron-rich species) attack Electrophiles (electron-poor species). This movement is often mapped out using "curved arrows" in mechanism diagrams.</p>

      <h3>Chirality and Stereochemistry</h3>
      <p>Many organic molecules are "chiral," meaning they have a non-superimposable mirror image—much like your left and right hands. This is crucial in pharmacology, as one version of a drug might be life-saving, while its mirror image could be inert or even harmful.</p>
    `,
    quiz: [
      {
        question: "Which functional group turns a molecule into an alcohol?",
        options: [
          "Carboxyl (-COOH)",
          "Carbonyl (=O)",
          "Hydroxyl (-OH)",
          "Amino (-NH2)",
        ],
        correctIndex: 2,
      },
      {
        question:
          "In an Sn2 reaction, from which direction does the nucleophile attack?",
        options: [
          "The Frontside",
          "The Backside",
          "Any direction",
          "The Side-chain",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "sg-3",
    title: "Macroeconomics: Global Markets",
    subject: "Economics",
    summary:
      "Analyze GDP, inflation, fiscal policy, and the mechanics of international trade in the 21st century.",
    difficulty: "Intermediate",
    readTime: "25 min",
    imageUrl:
      "https://images.unsplash.com/photo-1591696208200-73d52141b7c0?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>The Wealth of Nations</h2>
      <p>Macroeconomics looks at the economy as a whole, focusing on broad issues such as unemployment, GDP growth, and inflation. It seeks to understand why economies grow over time and what causes periodic recessions.</p>
      
      <div class="my-10 rounded-3xl overflow-hidden border border-[#1a1a1a] shadow-2xl">
        <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200" alt="Economic Strategy" class="w-full h-80 object-cover grayscale opacity-80" />
      </div>

      <h3>Measuring Economic Activity: GDP</h3>
      <p>Gross Domestic Product (GDP) is the total value of everything produced by all the people and companies in the country. It is usually calculated as: GDP = Consumption + Investment + Government Spending + (Exports - Imports).</p>

      <h3>Monetary vs Fiscal Policy</h3>
      <p>Fiscal Policy is handled by the government through taxation and spending. Monetary Policy is handled by central banks (like the Federal Reserve) through adjusting interest rates and controlling the money supply.</p>

      <h3>Inflation and the Consumer Price Index</h3>
      <p>Inflation is the rate at which the general level of prices for goods and services is rising. While high inflation can erode purchasing power, moderate inflation is often seen as a sign of a healthy, growing economy.</p>
    `,
    quiz: [
      {
        question:
          "What concept describes an injection of spending leading to a larger overall increase in income?",
        options: [
          "The Invisible Hand",
          "The Multiplier Effect",
          "Stagflation",
          "The Phillips Curve",
        ],
        correctIndex: 1,
      },
      {
        question: "Which entity usually controls Monetary Policy?",
        options: [
          "The Ministry of Finance",
          "Commercial Banks",
          "The Central Bank",
          "The Treasury Department",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "sg-4",
    title: "The Roman Empire: Rise and Fall",
    subject: "History",
    summary:
      "From the founding myths to the fall of Constantinople, explore the political and social structures of Rome.",
    difficulty: "Beginner",
    readTime: "35 min",
    imageUrl:
      "https://images.unsplash.com/photo-1503917988258-f1978d442b6a?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>Eternal Rome: From Village to Empire</h2>
      <p>Rome started as a small village on the Tiber River in central Italy and grew into one of the largest and most influential empires in world history. Its legal codes, architectural styles, and language still influence Western civilization today.</p>

      <div class="my-10 rounded-3xl overflow-hidden border border-[#1a1a1a] shadow-2xl">
        <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1200" alt="Ancient Rome Architecture" class="w-full h-80 object-cover grayscale opacity-80" />
      </div>

      <h3>The Pax Romana</h3>
      <p>A period of relative peace and stability across the Roman Empire which lasted for over 200 years, beginning with the reign of Augustus. During this time, trade flourished, and the empire reached its greatest territorial extent.</p>

      <h3>Engineering Marvels</h3>
      <p>The Romans were master engineers. They built over 50,000 miles of roads, complex aqueducts to bring fresh water to cities, and massive structures like the Colosseum and the Pantheon, utilizing the revolutionary invention of concrete.</p>

      <h3>The Fall of the West</h3>
      <p>The decline was a slow process caused by a combination of internal corruption, economic instability, over-extension of borders, and pressure from "barbarian" tribes. In 476 AD, the last Western Emperor was deposed, though the Eastern Empire (Byzantium) would survive for another millennium.</p>
    `,
    quiz: [
      {
        question: "Who was the first Emperor of Rome?",
        options: ["Julius Caesar", "Augustus", "Nero", "Marcus Aurelius"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "sg-5",
    title: "Neuroscience: The Human Brain",
    subject: "Biology",
    summary:
      "An exploration of neural pathways, synaptic plasticity, and the biological basis of consciousness.",
    difficulty: "Advanced",
    readTime: "40 min",
    imageUrl:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>The Most Complex Object in the Known Universe</h2>
      <p>The human brain contains approximately 86 billion neurons, each connected to thousands of others, forming trillions of synapses. It is the center of our thoughts, emotions, and physical movements.</p>

      <div class="my-10 rounded-3xl overflow-hidden border border-[#1a1a1a] shadow-2xl">
        <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=1200" alt="Neural Network" class="w-full h-80 object-cover grayscale opacity-80" />
      </div>

      <h3>Neuroplasticity: The Adaptable Brain</h3>
      <p>Neuroplasticity is the brain's ability to reorganize itself by forming new neural connections throughout life. This is what allows us to learn new skills, recover from injuries, and adapt to new environments.</p>

      <h3>The Limbic System and Emotion</h3>
      <p>The amygdala and hippocampus are key parts of the limbic system, which processes emotions and memory. While the amygdala triggers our "fight or flight" response, the hippocampus is vital for converting short-term memories into long-term ones.</p>

      <h3>Consciousness and the Prefrontal Cortex</h3>
      <p>The prefrontal cortex is the part of the brain responsible for "executive functions" like decision-making, planning, and personality expression. It is one of the last parts of the brain to fully develop, often not reaching maturity until a person's mid-20s.</p>
    `,
    quiz: [
      {
        question: "Approximately how many neurons are in the human brain?",
        options: ["10 Million", "1 Billion", "86 Billion", "500 Billion"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "sg-6",
    title: "Artificial Intelligence Ethics",
    subject: "Philosophy",
    summary:
      "Examining the moral implications of autonomous systems, algorithmic bias, and the alignment problem.",
    difficulty: "Advanced",
    readTime: "30 min",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>The Moral Compass of Machines</h2>
      <p>As AI systems become more autonomous and integrated into society, the ethical questions they raise become increasingly urgent. Who is responsible when an AI makes a harmful decision?</p>

      <h3>Algorithmic Bias</h3>
      <p>AI models are trained on historical data, which often contains human prejudices. If not carefully corrected, algorithms can reinforce systemic biases in hiring, law enforcement, and credit scoring.</p>

      <h3>The Alignment Problem</h3>
      <p>This refers to the challenge of ensuring that an AI system's goals are perfectly aligned with human values. Even a well-intentioned goal can have catastrophic side effects if the machine lacks a nuanced understanding of moral constraints.</p>
    `,
    quiz: [
      {
        question: "What is 'The Alignment Problem'?",
        options: [
          "Programming code errors",
          "Hardware failure",
          "Mismatch between AI goals and human values",
          "Internet connectivity issues",
        ],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "sg-7",
    title: "Intro to Astrophysics",
    subject: "Astronomy",
    summary:
      "Discover the life cycles of stars, black holes, and the expansion of the universe.",
    difficulty: "Intermediate",
    readTime: "50 min",
    imageUrl:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>Voyage Through the Cosmos</h2>
      <p>Astrophysics applies the laws of physics and chemistry to explain the birth, life, and death of stars, planets, galaxies, nebulae and other objects in the universe.</p>

      <h3>The Lifecycle of a Star</h3>
      <p>Stars are born in nebulae, massive clouds of gas and dust. They spend most of their lives in the "Main Sequence" phase, fusing hydrogen into helium. Depending on their mass, they may eventually become white dwarfs, neutron stars, or black holes.</p>

      <h3>Dark Matter and Dark Energy</h3>
      <p>Visible matter accounts for only about 5% of the universe. The rest is comprised of Dark Matter, which provides gravitational glue, and Dark Energy, which is driving the accelerated expansion of the universe.</p>
    `,
    quiz: [
      {
        question: "What percentage of the universe is visible matter?",
        options: ["95%", "50%", "5%", "1%"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "sg-8",
    title: "Financial Literacy 101",
    subject: "Finance",
    summary:
      "Master the basics of budgeting, compound interest, and long-term investing strategies.",
    difficulty: "Beginner",
    readTime: "20 min",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    content: `
      <h2>Empowering Your Future</h2>
      <p>Financial literacy is the ability to understand and effectively use various financial skills, including personal financial management, budgeting, and investing.</p>

      <h3>The Power of Compound Interest</h3>
      <p>Albert Einstein reportedly called compound interest the "eighth wonder of the world." By reinvesting your earnings, your wealth can grow exponentially over time. The earlier you start, the more powerful it becomes.</p>

      <h3>The 50/30/20 Rule</h3>
      <p>A simple budgeting framework: 50% of income for Needs, 30% for Wants, and 20% for Savings and debt repayment. Consistency is the key to financial freedom.</p>
    `,
    quiz: [
      {
        question: "Which of these is considered a 'Need' in the 50/30/20 rule?",
        options: [
          "Streaming subscription",
          "Dining out",
          "Rent/Mortgage",
          "New sneakers",
        ],
        correctIndex: 2,
      },
    ],
  },
];

export const BLOG_POSTS: (BlogPost & { content: string; imageUrl: string })[] =
  [
    {
      id: "bp-1",
      title: "How AI is Revolutionizing Personalized Learning",
      date: "Oct 12, 2023",
      author: "Dr. Sarah Chen",
      category: "EdTech",
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
      excerpt:
        "Explore how adaptive algorithms are identifying student knowledge gaps in real-time to provide bespoke educational paths.",
      content: `
      <p>For decades, the standard model of education has been a one-size-fits-all approach. However, artificial intelligence is rapidly changing this paradigm. By leveraging machine learning, platforms like EduBoost AI can now analyze a student's learning patterns in real-time.</p>
      
      <h3>Adapting in Real-Time</h3>
      <p>Imagine a student struggling with calculus. Traditional textbooks can't tell when a reader is confused. An AI-powered tutor, however, can detect if a student is spending too much time on a specific question or frequently getting certain types of problems wrong. It can then automatically adjust the difficulty or provide targeted explanations before moving forward.</p>

      <h3>The Role of the Teacher</h3>
      <p>Does this mean AI will replace teachers? Quite the opposite. By automating the routine aspects of instruction and grading, AI frees up educators to focus on mentorship, social-emotional support, and complex project-based learning. The teacher becomes a facilitator of wisdom, rather than just a transmitter of information.</p>
    `,
    },
    {
      id: "bp-2",
      title: "The Psychology of Deep Work",
      date: "Nov 05, 2023",
      author: "Mark Sterling",
      category: "Productivity",
      imageUrl:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
      excerpt:
        'Understanding the state of "flow" and how to minimize cognitive switching costs in an age of constant distraction.',
      content: `
      <p>In our modern era of constant notifications and short-form content, the ability to focus deeply on a single task is becoming increasingly rare—and increasingly valuable. Cal Newport famously coined the term "Deep Work" to describe professional activities performed in a state of distraction-free concentration.</p>
      
      <h3>The Cost of Context Switching</h3>
      <p>Every time you check your email or peek at social media while studying, you pay a "switching cost." Research shows it can take up to 20 minutes to return to full focus after a minor distraction. Over a four-hour study session, these small breaks can effectively halve your productivity.</p>

      <h3>Creating a Deep Work Environment</h3>
      <p>To enter a state of flow, you must eliminate the possibility of distraction before it occurs. This means turning off notifications, using website blockers, and establishing a consistent "study ritual."</p>
    `,
    },
    {
      id: "bp-3",
      title: "Sustainable Engineering in Education",
      date: "Jan 15, 2024",
      author: "Elena Rodriguez",
      category: "Innovation",
      imageUrl:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
      excerpt:
        "How educational campuses are leading the charge in green architecture and sustainable resource management.",
      content: `
      <p>Sustainability is no longer just a buzzword in university brochures; it is becoming a core part of the physical and academic infrastructure of modern campuses. Schools are recognizing that their buildings and operations are teaching tools in their own right.</p>
      
      <h3>Living Laboratories</h3>
      <p>Many new university buildings are designed as "living laboratories." They feature transparent energy systems, vertical gardens, and gray-water recycling systems that students in engineering and environmental science programs can study and optimize in real-time.</p>
    `,
    },
    {
      id: "bp-4",
      title: "The Future of Remote Research",
      date: "Feb 20, 2024",
      author: "Prof. James Wilson",
      category: "Research",
      imageUrl:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      excerpt:
        "Examining how cloud computing and virtual labs are enabling global collaboration like never before.",
      content: `
      <p>The days of a researcher being tethered to a physical laboratory in a single city are coming to an end. The rise of "Virtual Labs" and high-performance cloud computing is democratizing research and allowing for unprecedented global collaboration.</p>
    `,
    },
    {
      id: "bp-5",
      title: "Gamification: Playing Your Way to an A",
      date: "Mar 02, 2024",
      author: "Alex Hunter",
      category: "Psychology",
      imageUrl:
        "https://images.unsplash.com/photo-1550745679-5652175dec79?auto=format&fit=crop&q=80&w=800",
      excerpt:
        "How game design elements like point scoring and competition can trigger dopamine for better retention.",
      content: `
      <p>Why is it so easy to spend five hours on a video game but so hard to spend one hour on a textbook? The answer lies in dopamine feedback loops. Gamification in education attempts to borrow these mechanics to make learning addictive.</p>
    `,
    },
    {
      id: "bp-6",
      title: "Open Source Education",
      date: "Apr 10, 2024",
      author: "Leo Grant",
      category: "Global",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
      excerpt:
        "The moral imperative for high-quality educational resources to be free for all.",
      content: `
      <p>In a digital world, the marginal cost of sharing information is zero. Therefore, there is a growing movement to ensure that the best educational resources are available to everyone, regardless of their ability to pay.</p>
    `,
    },
  ];

export const FAQS: FAQItem[] = [
  {
    question: "Is EduBoost AI truly free?",
    answer:
      "Yes, 100%. Our mission is to democratize education and ensure every student has access to world-class learning tools without financial barriers. We rely on grants and donations to keep the lights on.",
  },
  {
    question: "How do the learning games work?",
    answer:
      "Our interactive games make learning fun and engaging. Word Clash tests vocabulary with hints, True Scholar challenges your knowledge with True/False questions, Combat Terms helps you master synonyms and antonyms, Formula Scramble teaches you to order equations, and Timeline Traveler helps you remember historical events. Each game provides instant feedback and helps reinforce what you've learned.",
  },
  {
    question: "What games are available?",
    answer:
      "We offer 7 interactive learning games: Word Clash (vocabulary challenge), True Scholar (trivia questions), Definer Duel (match definitions), Combat Terms (synonyms & antonyms), Formula Scramble (arrange equations), Timeline Traveler (chronological ordering), and Scholar Game (ultimate mix combining all game types).",
  },
  {
    question: "Can I play games offline?",
    answer:
      "Our games are designed to work best online for real-time feedback and content updates. However, as a Progressive Web App, you can access previously loaded content offline. We recommend having an internet connection for the best experience.",
  },
  {
    question: "Do the games save my scores?",
    answer:
      "Currently, game scores are stored locally in your browser during your session. We're working on implementing cloud-based progress tracking so you can sync your scores across devices.",
  },
  {
    question: "How accurate is the AI Tutor?",
    answer:
      "Our AI is powered by Gemini, one of the most advanced models available. We ground its responses in a curated dataset of high-quality academic content to minimize errors. However, we always recommend verifying complex facts with your primary textbooks.",
  },
  {
    question: "Can I use this for university exams?",
    answer:
      "Absolutely. Many of our guides are designed for university-level subjects like Quantum Mechanics and Macroeconomics. Our goal is to supplement your classroom learning with interactive explanations.",
  },
  {
    question: "Does the platform save my progress?",
    answer:
      "Currently, we save your study notes and quiz progress locally in your browser. This means as long as you use the same device, your work will be waiting for you.",
  },
  {
    question: "Are there more subjects coming?",
    answer:
      "Yes! Our editorial team is constantly working with experts to add new guides. We aim to release 2-3 new high-quality study guides every month.",
  },
  {
    question: "How do I contribute content?",
    answer:
      "We love academic contributors! If you are a graduate student or professor interested in authoring a guide, please reach out via our contact page.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      'Our website is a Progressive Web App (PWA). You can "Add to Home Screen" on iOS or Android for a native app experience.',
  },
  {
    question: "Do you offer certificates?",
    answer:
      "We are currently exploring a blockchain-based credentialing system to allow students to prove mastery of certain subjects.",
  },
];

export const STUDY_MATERIALS: StudyMaterial[] = [
  // Physics
  {
    id: "mat-phys-1",
    subject: "Physics",
    chapter: "Modern Physics",
    type: "VIDEO",
    title: "Modern Physics Class 12 One Shot",
    url: "https://www.youtube.com/embed/_kFb8mdPhOU?si=Bekm2quUfr-i3sV-",
    description: "Complete revision of Modern Physics for Grade 12.",
    isOfflineReady: true,
  },
  {
    id: "mat-phys-2",
    subject: "Physics",
    chapter: "Electricity & Magnetism",
    type: "VIDEO",
    title: "Electromagnetism Class 12 - Nepal Online School",
    url: "https://www.youtube.com/embed/-lkaPYpvntw?si=ICtRhmXUcxNDZIcC",
    description: "Comprehensive coverage of electromagnetism concepts.",
    isOfflineReady: true,
  },
  {
    id: "mat-phys-3",
    subject: "Physics",
    chapter: "Mechanics",
    type: "PDF",
    title: "Projectile Motion 2D Motion Grade 12",
    url: "https://drive.google.com/file/d/1eeH-2sbUgOsryC_GpzXenCEJJltI8fpJ/view",
    description:
      "Complete projectile motion notes with 2D motion analysis for Grade 12.",
    isOfflineReady: true,
  },

  // Chemistry
  {
    id: "mat-chem-1",
    subject: "Chemistry",
    chapter: "Organic Chemistry",
    type: "PDF",
    title: "Organic Reaction Roadmaps",
    url: "https://drive.google.com/uc?export=download&id=13FNULl_m7iUQt69ka-p3pgFVkmGWcj_j",
    description: "Essential conversion maps for Grade 12 Organic Chemistry.",
    isOfflineReady: true,
  },
  {
    id: "mat-chem-2",
    subject: "Chemistry",
    chapter: "Physical Chemistry",
    type: "VIDEO",
    title: "Chemical Kinetics",
    url: "https://www.youtube.com/embed/FiQMcK4WV18?si=5vTd77DztZVdrO_o",
    description: "Understanding rates of reaction and activation energy.",
    isOfflineReady: false,
  },

  // Mathematics
  {
    id: "mat-math-1",
    subject: "Mathematics",
    chapter: "Calculus II",
    type: "VIDEO",
    title: "Antiderivatives & Integrals - Full Course",
    url: "https://www.youtube.com/embed/q3ZTXiPX2eM?si=7zkrL4OkbdLAqwV8",
    description: "Complete one-shot on integration techniques for NEB.",
    isOfflineReady: true,
  },
  {
    id: "mat-math-2",
    subject: "Mathematics",
    chapter: "Vectors",
    type: "PDF",
    title: "Vector Algebra Cheat Sheet",
    url: "https://drive.google.com/file/d/1RHltem_0z6CyjLrvtPDfKlDkBQw80dQ4/view?usp=sharing",
    description: "All major vector formulas in one page.",
    isOfflineReady: true,
  },
  {
    id: "mat-math-3",
    subject: "Mathematics",
    chapter: "Probability",
    type: "VIDEO",
    title: "Probability Basics for Grade 12",
    url: "https://www.youtube.com/embed/evXjM1Ki0bo?si=atT0UbjgH2dcx4YW",
    description: "Bayes Theorem and Binomial Distribution explained.",
    isOfflineReady: false,
  },

  // Computer Science
  {
    id: "mat-cs-1",
    subject: "Computer Science",
    chapter: "C Programming",
    type: "PDF",
    title: "Top 50 C Programs for Board",
    url: "https://drive.google.com/uc?export=download&id=1j5aqHoGUbIMhU49QDdQ4DsaZ0wxx9K2y",
    description: "Essential C programs curated for NEB 2082.",
    isOfflineReady: true,
  },
  {
    id: "mat-cs-2",
    subject: "Computer Science",
    chapter: "DBMS",
    type: "VIDEO",
    title: "Normalization & SQL Mastery",
    url: "https://www.youtube.com/embed/GjnwJ9u33Hg?si=fGF_jTav9bimGCVz",
    description: "Complete Database Management Systems revision.",
    isOfflineReady: true,
  },

  // Biology
  {
    id: "mat-bio-1",
    subject: "Biology",
    chapter: "Genetics",
    type: "VIDEO",
    title: "Genetics One Shot - Bio Revision",
    url: "https://www.youtube.com/embed/WtTIxt8BvxY?si=FUQAKYChMBinmeYg",
    description: "Overivew of Mendelian genetics and molecular biology.",
    isOfflineReady: true,
  },
  {
    id: "mat-bio-2",
    subject: "Biology",
    chapter: "Botany",
    type: "PDF",
    title: "Plant Anatomy Diagrams & Notes",
    url: "https://drive.google.com/file/d/1xij1sjel1xFahKcL2WNbjHbPDDWzO0KV/view",
    description:
      "High-quality diagrams and notes for Botany anatomy questions.",
    isOfflineReady: true,
  },
  {
    id: "mat-bio-3",
    subject: "Biology",
    chapter: "Botany",
    type: "PDF",
    title: "Additional Biology Study Materials",
    url: "https://drive.google.com/file/d/1RHltem_0z6CyjLrvtPDfKlDkBQw80dQ4/view",
    description: "Comprehensive biology study materials and notes.",
    isOfflineReady: true,
  },

  // General
  {
    id: "mat-neb-2082",
    subject: "All",
    chapter: "General",
    type: "PDF",
    title: "CDC 2081/82 Model Set",
    url: "https://drive.google.com/uc?export=download&id=1efOCv051udx7bx4S9Yo_At0cW6ENjF43",
    description: "Official CDC Nepal model question set for 2026 boards.",
    isOfflineReady: true,
  },

  // Additional Physics
  {
    id: "mat-phys-4",
    subject: "Physics",
    chapter: "Atomic Physics",
    type: "VIDEO",
    title: "Atomic Physics & Nuclear Reactions",
    url: "https://www.youtube.com/embed/H_lHXulg57g",
    description: "Complete coverage of atomic structure and nuclear physics.",
    isOfflineReady: true,
  },

  // Additional Chemistry
  {
    id: "mat-chem-3",
    subject: "Chemistry",
    chapter: "Inorganic Chemistry",
    type: "PDF",
    title: "Periodic Table & Trends",
    url: "https://drive.google.com/file/d/1_LBLSs75gbqYxc-0LfA-oxDcc8F1H-8g/view?usp=sharing",
    description:
      "Complete periodic table with electron configurations and trends.",
    isOfflineReady: true,
  },

  // Additional Mathematics
  {
    id: "mat-math-4",
    subject: "Mathematics",
    chapter: "Geometry",
    type: "PDF",
    title: "Coordinate Geometry All Formulas",
    url: "https://drive.google.com/file/d/1lzAsvziJdXixnj4x6e6FlXaOwBXlu3QK/view?usp=sharing",
    description:
      "All important formulas for coordinate geometry and conic sections.",
    isOfflineReady: true,
  },

  // Additional Computer Science
  {
    id: "mat-cs-3",
    subject: "Computer Science",
    chapter: "Networking",
    type: "VIDEO",
    title: "OSI Model & TCP/IP Protocols",
    url: "https://www.youtube.com/embed/1msEo8PIcbw",
    description: "Complete networking concepts for NEB Computer Science.",
    isOfflineReady: false,
  },

  // Additional Biology
  {
    id: "mat-bio-4",
    subject: "Biology",
    chapter: "Zoology",
    type: "PDF",
    title: "Animal Classification & Taxonomy",
    url: "https://drive.google.com/file/d/1bbk5jw5o4MkVPGFsX24FDDB2A3rvYx3t/view?usp=sharing",
    description:
      "Complete animal classification system and evolutionary biology.",
    isOfflineReady: true,
  },

  {
    id: "mat-bio-5",
    subject: "Biology",
    chapter: "Genetics",
    type: "PDF",
    title: "Inheritance Patterns & DNA Replication",
    url: "https://drive.google.com/file/d/1ROdSkHGsxldWfqOGNc_gHO5yV4LVeaQk/view?usp=sharing",
    description:
      "Mendelian genetics, inheritance patterns, and molecular genetics.",
    isOfflineReady: true,
  },
];
