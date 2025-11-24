export const ANIMALS = [
  { id: 'cat', emoji: '🐱', name: 'Cat', skill: 'Agile - Quick learner' },
  { id: 'dog', emoji: '🐕', name: 'Dog', skill: 'Empathetic - Great collaborator' },
  { id: 'owl', emoji: '🦉', name: 'Owl', skill: 'Wise - Deep thinker' },
  { id: 'fox', emoji: '🦊', name: 'Fox', skill: 'Clever - Problem solver' },
  { id: 'rabbit', emoji: '🐰', name: 'Rabbit', skill: 'Fast - Efficient worker' },
  { id: 'bear', emoji: '🐻', name: 'Bear', skill: 'Strong - Persistent' }
]

export const DISCIPLINES = [
  'Medicine and Surgery',
  'Economic Sciences',
  'Engineering and Computer Science',
  'Literature and Philosophy',
  'Mathematical and Computer Sciences',
  'Political Sciences',
  'Legal Sciences',
  'Agricultural and Environmental Sciences',
  'Chemical and Geological Sciences'
]

export const QUIZ_DATABASE = {
  peerReview: {
    question: "Which of these is a RED FLAG in peer review timelines?",
    options: [
      "Review completed in 24 hours",
      "Review takes 4-6 weeks",
      "Detailed feedback provided",
      "Multiple reviewers involved"
    ],
    correct: 0,
    explanation:
      "Legitimate peer review takes time. A 24-hour turnaround is suspiciously fast and likely indicates no real review occurred."
  },
  predatoryPractice: {
    question: "Which practices are NOT typical of legitimate scientific journals?",
    options: [
      "Aggressive email invitations & journal name imitation",
      "Peer review & DOI assignment",
      "Indexing in Scopus/Web of Science",
      "Clear editorial board information"
    ],
    correct: 0,
    explanation:
      "Predatory journals often use aggressive marketing and mimic legitimate journal names to deceive authors."
  },
  apcModel: {
    question: "What should you consider about Article Processing Charges (APCs)?",
    options: [
      "Higher fees always mean better quality",
      "Legitimate journals never charge fees",
      "Transparent fee structure is important",
      "Fast-track fees are always ethical"
    ],
    correct: 2,
    explanation:
      "Legitimate journals have transparent fee structures. Be wary of hidden costs or excessive fast-track fees."
  },
  dataManipulation: {
    question: "How can you detect data manipulation in a research paper?",
    options: [
      "Perfect results with no outliers",
      "Detailed methodology section",
      "Raw data availability",
      "Institutional affiliations"
    ],
    correct: 0,
    explanation:
      "Perfect results without any outliers or variations are often a sign of fabricated or manipulated data."
  },
  ethicalPublishing: {
    question: "A journal offers fast-track publication for $3000. Is this ethical?",
    options: [
      "Always ethical if disclosed",
      "Never ethical under any circumstances",
      "Depends on transparency and review quality",
      "Only ethical for urgent research"
    ],
    correct: 2,
    explanation:
      "Fast-track options can be ethical if transparent and if the peer review quality is maintained."
  }
}

export const EVENT_SCENARIOS = {
  parrotThief: {
    title: "The Paper Thief Parrot! 🦜",
    description: "A parrot has flown into your office and stolen your manuscript! What do you do?",
    choices: [
      { text: "Chase the parrot", effect: { skip: 1 } },
      { text: "Use backup copy", effect: { reputation: 2 } },
      { text: "Call for help", effect: { coins: -10 } }
    ]
  },
  plantJournal: {
    title: "Carnivorous Journal! 🌱",
    description: "A suspicious journal is aggressively requesting your paper with promises of instant publication!",
    choices: [
      { text: "Submit immediately", effect: { reputation: -5, knowledge: -2 } },
      { text: "Research the journal first", effect: { reputation: 3, knowledge: 5 } },
      { text: "Politely decline", effect: { reputation: 1 } }
    ]
  },
  fakeReview: {
    title: "Suspicious Review! 🔍",
    description: "You received a peer review in just 2 hours with only praise and no constructive feedback.",
    choices: [
      { text: "Accept and publish", effect: { reputation: -10 } },
      { text: "Request detailed review", effect: { reputation: 5, knowledge: 3 } },
      { text: "Withdraw submission", effect: { reputation: 2 } }
    ]
  },
  collaboration: {
    title: "Collaboration Opportunity! 🤝",
    description: "A renowned researcher wants co-authorship without contribution.",
    choices: [
      { text: "Accept for prestige", effect: { reputation: -3, coins: 20 } },
      { text: "Propose fair contribution", effect: { reputation: 5, knowledge: 5 } },
      { text: "Decline politely", effect: { reputation: 2 } }
    ]
  }
}
