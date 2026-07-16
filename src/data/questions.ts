export type Question = {
  id: string
  text: string
  category: "behavioral" | "technical" | "system-design" | "product" | "leadership"
  company?: "google" | "meta" | "amazon" | "microsoft" | "apple" | "netflix" | "stripe" | "general"
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
}

export const questions: Question[] = [
  // BEHAVIORAL (25 questions)
  { id: "b1", text: "Tell me about a time you failed and what you learned from it.", category: "behavioral", difficulty: "medium", tags: ["failure", "growth"], company: "general" },
  { id: "b2", text: "Describe a situation where you had to work with a difficult colleague.", category: "behavioral", difficulty: "medium", tags: ["teamwork", "conflict"], company: "general" },
  { id: "b3", text: "Tell me about a time you had to meet a very tight deadline.", category: "behavioral", difficulty: "medium", tags: ["pressure", "delivery"], company: "general" },
  { id: "b4", text: "Describe the project you are most proud of and your role in it.", category: "behavioral", difficulty: "easy", tags: ["accomplishment"], company: "general" },
  { id: "b5", text: "Tell me about a time you showed leadership without formal authority.", category: "behavioral", difficulty: "hard", tags: ["leadership", "influence"], company: "google" },
  { id: "b6", text: "Describe a time you had to make a decision with incomplete information.", category: "behavioral", difficulty: "hard", tags: ["judgment", "ambiguity"], company: "general" },
  { id: "b7", text: "Tell me about a time you received critical feedback. How did you respond?", category: "behavioral", difficulty: "easy", tags: ["feedback", "growth"], company: "general" },
  { id: "b8", text: "Describe a situation where you had to prioritize competing demands.", category: "behavioral", difficulty: "medium", tags: ["prioritization"], company: "amazon" },
  { id: "b9", text: "Tell me about a time you went above and beyond what was expected.", category: "behavioral", difficulty: "easy", tags: ["initiative"], company: "amazon" },
  { id: "b10", text: "Describe a time you had to persuade someone to change their mind.", category: "behavioral", difficulty: "medium", tags: ["communication", "influence"], company: "meta" },
  { id: "b11", text: "Tell me about a conflict with a teammate and how you resolved it.", category: "behavioral", difficulty: "medium", tags: ["conflict", "resolution"], company: "general" },
  { id: "b12", text: "Describe a time you introduced a process improvement that saved time or money.", category: "behavioral", difficulty: "medium", tags: ["efficiency", "impact"], company: "general" },
  { id: "b13", text: "Tell me about a time you had to deal with significant ambiguity on a project.", category: "behavioral", difficulty: "hard", tags: ["ambiguity", "leadership"], company: "google" },
  { id: "b14", text: "Describe a situation where you failed to meet a goal. What happened and what did you learn?", category: "behavioral", difficulty: "medium", tags: ["failure", "accountability"], company: "amazon" },
  { id: "b15", text: "Tell me about a time you mentored or coached someone.", category: "behavioral", difficulty: "easy", tags: ["mentorship", "growth"], company: "general" },
  { id: "b16", text: "Describe a time you took a calculated risk that paid off.", category: "behavioral", difficulty: "hard", tags: ["risk", "judgment"], company: "meta" },
  { id: "b17", text: "What is your biggest professional accomplishment in the last 2 years?", category: "behavioral", difficulty: "easy", tags: ["accomplishment", "impact"], company: "general" },
  { id: "b18", text: "Describe a time you had to adapt quickly to a major change.", category: "behavioral", difficulty: "medium", tags: ["adaptability", "change"], company: "microsoft" },
  { id: "b19", text: "Tell me about a time you delivered a project with limited resources.", category: "behavioral", difficulty: "medium", tags: ["resourcefulness", "frugality"], company: "amazon" },
  { id: "b20", text: "Describe a time you had to manage a crisis or unexpected incident.", category: "behavioral", difficulty: "hard", tags: ["crisis", "leadership"], company: "stripe" },
  { id: "b21", text: "Tell me about a time you disagreed with your manager. How did you handle it?", category: "behavioral", difficulty: "hard", tags: ["conflict", "communication"], company: "general" },
  { id: "b22", text: "Describe a time when you had to earn someone's trust.", category: "behavioral", difficulty: "medium", tags: ["trust", "relationship"], company: "general" },
  { id: "b23", text: "Tell me about a time you had to communicate a complex idea to a non-technical audience.", category: "behavioral", difficulty: "medium", tags: ["communication"], company: "general" },
  { id: "b24", text: "Describe a time you spotted a problem before it became a crisis.", category: "behavioral", difficulty: "medium", tags: ["proactivity", "judgment"], company: "netflix" },
  { id: "b25", text: "Tell me about a situation where you had to build something under-resourced.", category: "behavioral", difficulty: "hard", tags: ["resourcefulness"], company: "stripe" },

  // TECHNICAL (25 questions)
  { id: "t1", text: "What is the difference between REST and GraphQL? When would you choose one over the other?", category: "technical", difficulty: "medium", tags: ["API", "architecture"], company: "general" },
  { id: "t2", text: "Explain how a database index works and when you would (and wouldn't) use one.", category: "technical", difficulty: "medium", tags: ["database", "performance"], company: "general" },
  { id: "t3", text: "What is a race condition and how do you prevent it in a concurrent system?", category: "technical", difficulty: "hard", tags: ["concurrency", "bugs"], company: "general" },
  { id: "t4", text: "What are the key differences between SQL and NoSQL databases? When do you use each?", category: "technical", difficulty: "easy", tags: ["database"], company: "general" },
  { id: "t5", text: "How does HTTP caching work? Explain Cache-Control and ETag headers.", category: "technical", difficulty: "medium", tags: ["HTTP", "performance"], company: "general" },
  { id: "t6", text: "What is the difference between authentication and authorization?", category: "technical", difficulty: "easy", tags: ["security", "auth"], company: "general" },
  { id: "t7", text: "Explain how garbage collection works. What are the tradeoffs of different GC strategies?", category: "technical", difficulty: "hard", tags: ["memory", "performance"], company: "google" },
  { id: "t8", text: "What is eventual consistency in distributed systems? How do you handle it?", category: "technical", difficulty: "hard", tags: ["distributed", "consistency"], company: "general" },
  { id: "t9", text: "What is a load balancer and what load balancing algorithms do you know?", category: "technical", difficulty: "medium", tags: ["infrastructure", "scalability"], company: "general" },
  { id: "t10", text: "Explain the difference between a process and a thread.", category: "technical", difficulty: "medium", tags: ["operating-systems", "concurrency"], company: "general" },
  { id: "t11", text: "Walk me through how you would debug a performance issue in a production service.", category: "technical", difficulty: "hard", tags: ["debugging", "performance"], company: "meta" },
  { id: "t12", text: "What are SOLID principles? Give a practical example of each.", category: "technical", difficulty: "medium", tags: ["design", "OOP"], company: "microsoft" },
  { id: "t13", text: "Explain how React's virtual DOM works and what problems it solves.", category: "technical", difficulty: "medium", tags: ["React", "frontend"], company: "meta" },
  { id: "t14", text: "What is database normalization? What are the tradeoffs of normalizing vs denormalizing?", category: "technical", difficulty: "medium", tags: ["database", "design"], company: "general" },
  { id: "t15", text: "How do you approach database migrations in a production system with zero downtime?", category: "technical", difficulty: "hard", tags: ["database", "deployment"], company: "stripe" },
  { id: "t16", text: "What is dependency injection and why is it useful?", category: "technical", difficulty: "medium", tags: ["design-patterns", "testing"], company: "microsoft" },
  { id: "t17", text: "Explain how pub/sub messaging works and when you would use it vs direct API calls.", category: "technical", difficulty: "medium", tags: ["messaging", "architecture"], company: "general" },
  { id: "t18", text: "What is the CAP theorem? Give a real-world example of each type of system.", category: "technical", difficulty: "hard", tags: ["distributed", "theory"], company: "google" },
  { id: "t19", text: "How does TCP/IP differ from UDP? When would you choose each?", category: "technical", difficulty: "easy", tags: ["networking"], company: "general" },
  { id: "t20", text: "What are WebSockets and how do they differ from HTTP long polling?", category: "technical", difficulty: "medium", tags: ["networking", "realtime"], company: "general" },
  { id: "t21", text: "Explain how you would implement rate limiting in an API.", category: "technical", difficulty: "medium", tags: ["API", "security"], company: "stripe" },
  { id: "t22", text: "What is a deadlock? How do you detect and prevent it?", category: "technical", difficulty: "hard", tags: ["concurrency", "bugs"], company: "general" },
  { id: "t23", text: "How does HTTPS work? Walk me through the TLS handshake.", category: "technical", difficulty: "medium", tags: ["security", "networking"], company: "general" },
  { id: "t24", text: "What is memoization and when is it useful?", category: "technical", difficulty: "easy", tags: ["optimization", "algorithms"], company: "general" },
  { id: "t25", text: "How would you design a CI/CD pipeline for a large monorepo?", category: "technical", difficulty: "hard", tags: ["DevOps", "infrastructure"], company: "general" },

  // SYSTEM DESIGN (20 questions)
  { id: "sd1", text: "Design a URL shortener like bit.ly. Handle 100M URLs and 10B clicks/day.", category: "system-design", difficulty: "medium", tags: ["hashing", "scalability"], company: "general" },
  { id: "sd2", text: "Design Twitter's home timeline feed for 300M users.", category: "system-design", difficulty: "hard", tags: ["feeds", "fanout", "caching"], company: "meta" },
  { id: "sd3", text: "Design a distributed rate limiter for an API serving 1B requests/day.", category: "system-design", difficulty: "hard", tags: ["rate-limiting", "distributed"], company: "stripe" },
  { id: "sd4", text: "Design a file storage service like Dropbox or Google Drive.", category: "system-design", difficulty: "hard", tags: ["storage", "sync"], company: "google" },
  { id: "sd5", text: "Design a real-time notification system that supports push, email, and SMS.", category: "system-design", difficulty: "medium", tags: ["notifications", "async"], company: "general" },
  { id: "sd6", text: "Design a search autocomplete system that returns suggestions in <100ms.", category: "system-design", difficulty: "medium", tags: ["search", "trie", "caching"], company: "google" },
  { id: "sd7", text: "Design a video streaming platform that serves 1B videos/day.", category: "system-design", difficulty: "hard", tags: ["CDN", "encoding", "streaming"], company: "netflix" },
  { id: "sd8", text: "Design a distributed cache like Redis or Memcached.", category: "system-design", difficulty: "hard", tags: ["caching", "distributed"], company: "general" },
  { id: "sd9", text: "Design a chat application like WhatsApp that supports group chats.", category: "system-design", difficulty: "hard", tags: ["messaging", "websockets"], company: "meta" },
  { id: "sd10", text: "Design a ride-sharing matching system like Uber or Lyft.", category: "system-design", difficulty: "hard", tags: ["geospatial", "matching"], company: "general" },
  { id: "sd11", text: "Design a content delivery network (CDN) from scratch.", category: "system-design", difficulty: "hard", tags: ["CDN", "caching", "networking"], company: "general" },
  { id: "sd12", text: "Design a distributed task queue like Celery or SQS.", category: "system-design", difficulty: "medium", tags: ["queue", "async"], company: "general" },
  { id: "sd13", text: "Design an API gateway that handles auth, rate limiting, and routing.", category: "system-design", difficulty: "medium", tags: ["API", "gateway"], company: "general" },
  { id: "sd14", text: "Design a recommendation engine for an e-commerce platform.", category: "system-design", difficulty: "hard", tags: ["ML", "recommendations"], company: "amazon" },
  { id: "sd15", text: "Design a real-time collaborative editor like Google Docs.", category: "system-design", difficulty: "hard", tags: ["CRDT", "OT", "realtime"], company: "google" },
  { id: "sd16", text: "Design a payment processing system that handles 1M transactions/day.", category: "system-design", difficulty: "hard", tags: ["payments", "consistency"], company: "stripe" },
  { id: "sd17", text: "Design a hotel booking system like Booking.com.", category: "system-design", difficulty: "medium", tags: ["inventory", "concurrency"], company: "general" },
  { id: "sd18", text: "Design an event sourcing system for financial transactions.", category: "system-design", difficulty: "hard", tags: ["event-sourcing", "CQRS"], company: "stripe" },
  { id: "sd19", text: "Design a key-value store with persistence like a simplified Redis.", category: "system-design", difficulty: "hard", tags: ["storage", "distributed"], company: "general" },
  { id: "sd20", text: "Design Instagram's photo storage and serving infrastructure.", category: "system-design", difficulty: "medium", tags: ["CDN", "storage", "media"], company: "meta" },

  // PRODUCT (20 questions)
  { id: "p1", text: "How would you improve Gmail? What would you build and why?", category: "product", difficulty: "medium", tags: ["product-design", "email"], company: "google" },
  { id: "p2", text: "Design a product to help elderly users video call their family easily.", category: "product", difficulty: "medium", tags: ["accessibility", "UX"], company: "general" },
  { id: "p3", text: "What metrics would you track for a consumer messaging app? What's your north star?", category: "product", difficulty: "medium", tags: ["metrics", "analytics"], company: "meta" },
  { id: "p4", text: "How do you prioritize features when you have 10x more requests than capacity?", category: "product", difficulty: "hard", tags: ["prioritization", "strategy"], company: "general" },
  { id: "p5", text: "How would you investigate a sudden 20% drop in user engagement?", category: "product", difficulty: "hard", tags: ["analytics", "investigation"], company: "general" },
  { id: "p6", text: "What feature would you add to Spotify to improve subscriber retention?", category: "product", difficulty: "medium", tags: ["retention", "subscription"], company: "general" },
  { id: "p7", text: "How would you monetize a free product with 1 million daily active users?", category: "product", difficulty: "hard", tags: ["monetization", "strategy"], company: "general" },
  { id: "p8", text: "Describe how you would design and run an A/B test for a new feature.", category: "product", difficulty: "medium", tags: ["experimentation", "analytics"], company: "meta" },
  { id: "p9", text: "How would you improve LinkedIn to help users find jobs faster?", category: "product", difficulty: "medium", tags: ["product-design", "career"], company: "microsoft" },
  { id: "p10", text: "What would you do if your biggest competitor just shipped a feature you were planning?", category: "product", difficulty: "hard", tags: ["strategy", "competition"], company: "general" },
  { id: "p11", text: "How do you gather user feedback and turn it into actionable product requirements?", category: "product", difficulty: "easy", tags: ["user-research", "process"], company: "general" },
  { id: "p12", text: "Walk me through a product decision you made, your reasoning, and the outcome.", category: "product", difficulty: "medium", tags: ["decision-making"], company: "general" },
  { id: "p13", text: "What is the difference between output metrics and outcome metrics? Give examples.", category: "product", difficulty: "easy", tags: ["metrics", "OKR"], company: "general" },
  { id: "p14", text: "How would you handle a feature that users hate but your CEO is excited about?", category: "product", difficulty: "hard", tags: ["stakeholder", "conflict"], company: "general" },
  { id: "p15", text: "How would you build a product for a market you know nothing about?", category: "product", difficulty: "hard", tags: ["research", "strategy"], company: "amazon" },
  { id: "p16", text: "Design a feature to reduce churn for a B2B SaaS subscription product.", category: "product", difficulty: "hard", tags: ["retention", "B2B"], company: "general" },
  { id: "p17", text: "How do you decide when to fix bugs vs build new features?", category: "product", difficulty: "medium", tags: ["prioritization", "quality"], company: "general" },
  { id: "p18", text: "What would you improve about Airbnb's host experience?", category: "product", difficulty: "medium", tags: ["marketplace", "UX"], company: "general" },
  { id: "p19", text: "How would you increase the number of sellers on an e-commerce marketplace?", category: "product", difficulty: "medium", tags: ["marketplace", "growth"], company: "amazon" },
  { id: "p20", text: "Design a product for a developing country with low internet bandwidth.", category: "product", difficulty: "hard", tags: ["accessibility", "global"], company: "meta" },

  // LEADERSHIP (20 questions)
  { id: "l1", text: "Tell me about a time you led a cross-functional team through a difficult project.", category: "leadership", difficulty: "hard", tags: ["cross-functional", "influence"], company: "general" },
  { id: "l2", text: "How do you handle an underperforming team member?", category: "leadership", difficulty: "hard", tags: ["performance", "management"], company: "general" },
  { id: "l3", text: "Describe your management style and how you adapt it to different people.", category: "leadership", difficulty: "medium", tags: ["management", "style"], company: "general" },
  { id: "l4", text: "Tell me about a time you had to deliver difficult news to your team.", category: "leadership", difficulty: "medium", tags: ["communication", "empathy"], company: "general" },
  { id: "l5", text: "How do you motivate a team when morale is low after a failed launch?", category: "leadership", difficulty: "hard", tags: ["morale", "recovery"], company: "general" },
  { id: "l6", text: "Describe a time you had to make a tough call that was unpopular with the team.", category: "leadership", difficulty: "hard", tags: ["decision-making", "courage"], company: "amazon" },
  { id: "l7", text: "How do you balance your own technical work with management responsibilities?", category: "leadership", difficulty: "medium", tags: ["time-management", "balance"], company: "general" },
  { id: "l8", text: "Tell me about a time you built a team from scratch.", category: "leadership", difficulty: "hard", tags: ["hiring", "team-building"], company: "general" },
  { id: "l9", text: "How do you handle persistent conflict between two of your direct reports?", category: "leadership", difficulty: "hard", tags: ["conflict", "mediation"], company: "general" },
  { id: "l10", text: "Describe your approach to giving critical feedback. Walk me through a real example.", category: "leadership", difficulty: "medium", tags: ["feedback", "communication"], company: "general" },
  { id: "l11", text: "Tell me about a time your team missed a critical deadline. What did you do?", category: "leadership", difficulty: "hard", tags: ["accountability", "recovery"], company: "general" },
  { id: "l12", text: "How do you set goals and track progress for your team each quarter?", category: "leadership", difficulty: "medium", tags: ["OKR", "planning"], company: "google" },
  { id: "l13", text: "Describe a time you had to advocate for your team's resources or priorities to senior leadership.", category: "leadership", difficulty: "hard", tags: ["advocacy", "communication"], company: "general" },
  { id: "l14", text: "How do you keep remote or distributed team members engaged and aligned?", category: "leadership", difficulty: "medium", tags: ["remote", "engagement"], company: "general" },
  { id: "l15", text: "Describe a time you had to significantly change direction mid-project.", category: "leadership", difficulty: "hard", tags: ["pivot", "change-management"], company: "general" },
  { id: "l16", text: "How do you approach hiring? What do you optimize for — skills, culture fit, or potential?", category: "leadership", difficulty: "medium", tags: ["hiring", "values"], company: "netflix" },
  { id: "l17", text: "Tell me about a time you enabled someone on your team to take on a bigger role.", category: "leadership", difficulty: "medium", tags: ["growth", "empowerment"], company: "microsoft" },
  { id: "l18", text: "What is your approach to 1:1 meetings? How do you make them valuable?", category: "leadership", difficulty: "easy", tags: ["management", "communication"], company: "general" },
  { id: "l19", text: "Tell me about a time you had to rebuild trust with a skeptical stakeholder or client.", category: "leadership", difficulty: "hard", tags: ["trust", "relationship"], company: "general" },
  { id: "l20", text: "How have you grown as a leader in the past 2 years? What changed?", category: "leadership", difficulty: "easy", tags: ["self-awareness", "growth"], company: "general" },
]

export function getQuestionsByCategory(category: string): Question[] {
  return questions.filter(q => q.category === category)
}

export function getQuestionsByCompany(company: string): Question[] {
  return questions.filter(q => q.company === company)
}

export function getRandomQuestion(category?: string): Question {
  const pool = category ? getQuestionsByCategory(category) : questions
  return pool[Math.floor(Math.random() * pool.length)]
}
