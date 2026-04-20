-- Seed data for the jobs table
-- Run this after applying the migration to populate initial job listings

insert into public.jobs (
  slug, title, company, company_logo, location, location_type, job_type,
  experience_level, salary_min, salary_max, salary_currency, salary_period,
  description, responsibilities, requirements, nice_to_have, tags,
  category, application_url, source_url, featured, posted_at, views
) values
(
  'senior-frontend-engineer-google',
  'Senior Frontend Engineer',
  'Google',
  'https://logo.clearbit.com/google.com',
  'Mountain View, CA', 'hybrid', 'full-time', 'senior',
  160000, 220000, 'USD', 'year',
  'Join Google''s core search team to build the next generation of web experiences. You''ll work on high-impact products used by billions of people worldwide, collaborating with world-class engineers and designers.',
  ARRAY[
    'Lead frontend architecture decisions for large-scale web applications',
    'Collaborate with product managers and designers to deliver exceptional user experiences',
    'Mentor junior engineers and conduct thorough code reviews',
    'Drive performance optimizations across Google''s web products',
    'Contribute to open-source projects and internal tooling'
  ],
  ARRAY[
    '5+ years of experience in frontend development',
    'Deep expertise in React, TypeScript, and modern CSS',
    'Experience with large-scale distributed systems',
    'Strong understanding of web performance and accessibility',
    'Bachelor''s degree in Computer Science or equivalent experience'
  ],
  ARRAY[
    'Experience with WebAssembly or Web Workers',
    'Contributions to open-source projects',
    'Knowledge of GraphQL and Apollo'
  ],
  ARRAY['React', 'TypeScript', 'CSS', 'Performance', 'Accessibility'],
  'Engineering', 'https://careers.google.com', 'https://careers.google.com',
  true, '2026-04-15T09:00:00Z', 1243
),
(
  'product-designer-notion',
  'Product Designer',
  'Notion',
  'https://logo.clearbit.com/notion.so',
  'San Francisco, CA', 'remote', 'full-time', 'mid',
  130000, 170000, 'USD', 'year',
  'Notion is looking for a talented Product Designer to help shape the future of productivity software. You''ll own end-to-end design for key product areas, working closely with engineering and product teams.',
  ARRAY[
    'Own design for multiple product areas from concept to shipping',
    'Conduct user research and usability testing',
    'Create and maintain design systems and component libraries',
    'Collaborate with cross-functional teams to align on product strategy',
    'Deliver high-fidelity prototypes and design specs'
  ],
  ARRAY[
    '3+ years of product design experience',
    'Proficiency in Figma and prototyping tools',
    'Strong portfolio demonstrating end-to-end design process',
    'Experience designing for B2B SaaS products',
    'Excellent communication and storytelling skills'
  ],
  ARRAY[
    'Experience with design systems at scale',
    'Basic understanding of HTML/CSS',
    'Experience with motion design'
  ],
  ARRAY['Figma', 'UX', 'Design Systems', 'Prototyping', 'SaaS'],
  'Design', 'https://notion.so/careers', 'https://notion.so/careers',
  true, '2026-04-16T10:00:00Z', 876
),
(
  'backend-engineer-stripe',
  'Backend Engineer',
  'Stripe',
  'https://logo.clearbit.com/stripe.com',
  'Remote', 'remote', 'full-time', 'mid',
  140000, 190000, 'USD', 'year',
  'Stripe is hiring backend engineers to help build the financial infrastructure of the internet. You''ll work on core payment systems that process billions of dollars in transactions.',
  ARRAY[
    'Build and maintain scalable backend services in Ruby and Go',
    'Design and implement APIs used by millions of developers',
    'Improve system reliability, performance, and observability',
    'Collaborate with product teams to ship new features',
    'Participate in on-call rotations to support production systems'
  ],
  ARRAY[
    '3+ years of backend engineering experience',
    'Strong proficiency in at least one backend language (Ruby, Go, Java)',
    'Experience with distributed systems and microservices',
    'Understanding of databases, caching, and message queues',
    'Experience with cloud infrastructure (AWS, GCP)'
  ],
  ARRAY[
    'Experience in fintech or payments',
    'Knowledge of PCI compliance',
    'Contributions to developer tools'
  ],
  ARRAY['Ruby', 'Go', 'APIs', 'Distributed Systems', 'Payments'],
  'Engineering', 'https://stripe.com/jobs', 'https://stripe.com/jobs',
  false, '2026-04-14T08:00:00Z', 654
),
(
  'devops-engineer-vercel',
  'DevOps Engineer',
  'Vercel',
  'https://logo.clearbit.com/vercel.com',
  'Remote', 'remote', 'full-time', 'senior',
  150000, 200000, 'USD', 'year',
  'Vercel is looking for a DevOps Engineer to help scale our global edge network. You''ll work on infrastructure that powers millions of deployments every day.',
  ARRAY[
    'Design and maintain CI/CD pipelines for our engineering teams',
    'Manage Kubernetes clusters across multiple cloud providers',
    'Implement infrastructure as code using Terraform',
    'Monitor and improve system reliability and performance',
    'Collaborate with security team on compliance and hardening'
  ],
  ARRAY[
    '4+ years of DevOps or SRE experience',
    'Strong Kubernetes and container orchestration expertise',
    'Proficiency with Terraform or similar IaC tools',
    'Experience with major cloud providers (AWS, GCP, Azure)',
    'Strong scripting skills in Bash or Python'
  ],
  ARRAY[
    'Experience with edge computing',
    'Knowledge of eBPF or networking internals',
    'Open source contributions'
  ],
  ARRAY['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'SRE'],
  'Engineering', 'https://vercel.com/careers', 'https://vercel.com/careers',
  false, '2026-04-13T07:00:00Z', 432
),
(
  'data-scientist-openai',
  'Data Scientist',
  'OpenAI',
  'https://logo.clearbit.com/openai.com',
  'San Francisco, CA', 'hybrid', 'full-time', 'mid',
  155000, 210000, 'USD', 'year',
  'OpenAI is seeking a Data Scientist to help us understand model behavior, measure safety, and drive data-informed decisions across our research and product teams.',
  ARRAY[
    'Analyze model outputs and performance metrics at scale',
    'Design and run experiments to measure model improvements',
    'Build dashboards and tooling for model evaluation',
    'Collaborate with research teams on safety benchmarks',
    'Communicate insights to technical and non-technical stakeholders'
  ],
  ARRAY[
    '3+ years of data science experience',
    'Strong Python skills and ML library expertise (PyTorch, scikit-learn)',
    'Experience with large-scale data processing (Spark, BigQuery)',
    'Statistical modeling and experimental design expertise',
    'Master''s or PhD in a quantitative field preferred'
  ],
  ARRAY[
    'Experience with LLM evaluation',
    'Background in NLP research',
    'Knowledge of causal inference'
  ],
  ARRAY['Python', 'ML', 'PyTorch', 'Statistics', 'LLMs'],
  'Data & AI', 'https://openai.com/careers', 'https://openai.com/careers',
  true, '2026-04-17T11:00:00Z', 2107
),
(
  'marketing-manager-linear',
  'Marketing Manager',
  'Linear',
  'https://logo.clearbit.com/linear.app',
  'Remote', 'remote', 'full-time', 'mid',
  110000, 145000, 'USD', 'year',
  'Linear is looking for a Marketing Manager to help grow our developer-focused brand. You''ll craft campaigns that resonate with engineering teams and drive product adoption.',
  ARRAY[
    'Develop and execute content marketing strategies',
    'Manage social media presence and community engagement',
    'Plan and run paid acquisition campaigns',
    'Collaborate with product team on launches and announcements',
    'Track and report on marketing KPIs and growth metrics'
  ],
  ARRAY[
    '3+ years of B2B marketing experience',
    'Experience marketing developer or SaaS products',
    'Strong writing and communication skills',
    'Data-driven approach with analytics proficiency',
    'Experience with marketing automation tools'
  ],
  ARRAY[
    'Technical background or software engineering experience',
    'Experience with developer communities',
    'Video production skills'
  ],
  ARRAY['Content Marketing', 'B2B', 'SaaS', 'Growth', 'Analytics'],
  'Marketing', 'https://linear.app/careers', 'https://linear.app/careers',
  false, '2026-04-12T09:00:00Z', 321
),
(
  'ios-engineer-airbnb',
  'iOS Engineer',
  'Airbnb',
  'https://logo.clearbit.com/airbnb.com',
  'San Francisco, CA', 'hybrid', 'full-time', 'senior',
  170000, 230000, 'USD', 'year',
  'Airbnb''s iOS team is growing! Join us to build the mobile experience for millions of travelers and hosts around the world. You''ll own critical features of our flagship iOS app.',
  ARRAY[
    'Build and ship features in Airbnb''s iOS app used by millions',
    'Architect scalable and performant iOS solutions',
    'Partner with design to implement pixel-perfect UIs',
    'Write unit and integration tests for all code',
    'Participate in code reviews and technical planning'
  ],
  ARRAY[
    '5+ years of iOS development experience',
    'Expert-level Swift and UIKit/SwiftUI knowledge',
    'Experience with performance profiling and optimization',
    'Understanding of mobile architecture patterns (MVVM, Clean Architecture)',
    'App Store shipping experience'
  ],
  ARRAY[
    'Experience with React Native',
    'GraphQL knowledge',
    'Contributions to iOS open-source libraries'
  ],
  ARRAY['Swift', 'SwiftUI', 'iOS', 'Mobile', 'Objective-C'],
  'Engineering', 'https://careers.airbnb.com', 'https://careers.airbnb.com',
  false, '2026-04-11T10:00:00Z', 589
),
(
  'growth-engineer-figma',
  'Growth Engineer',
  'Figma',
  'https://logo.clearbit.com/figma.com',
  'San Francisco, CA', 'hybrid', 'full-time', 'mid',
  145000, 195000, 'USD', 'year',
  'Figma''s Growth team is looking for an engineer who loves building experiments and improving user onboarding, retention, and monetization. You''ll work at the intersection of product, data, and engineering.',
  ARRAY[
    'Build and run A/B tests to improve key growth metrics',
    'Develop and optimize user onboarding flows',
    'Analyze funnel data to identify conversion opportunities',
    'Collaborate with growth PMs and data scientists',
    'Instrument new features for tracking and analytics'
  ],
  ARRAY[
    '3+ years of software engineering experience',
    'Strong full-stack development skills (React, Node.js)',
    'Experience with experimentation frameworks',
    'Data analysis skills with SQL proficiency',
    'Product intuition and user empathy'
  ],
  ARRAY[
    'Previous growth engineering experience',
    'Experience with analytics platforms (Mixpanel, Amplitude)',
    'Knowledge of product-led growth strategies'
  ],
  ARRAY['React', 'Node.js', 'SQL', 'A/B Testing', 'Growth'],
  'Engineering', 'https://figma.com/careers', 'https://figma.com/careers',
  false, '2026-04-10T09:00:00Z', 445
);

insert into public.blogs (
  slug, title, excerpt, cover_image, content_html, tags, featured, status,
  reading_time_minutes, published_at
) values
(
  'how-to-stand-out-in-remote-job-applications',
  'How to Stand Out in Remote Job Applications',
  'Practical ways to improve your resume, portfolio, and outreach when applying to remote roles.',
  'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=1400&q=80',
  '<h2>Why remote applications are different</h2><p>Remote roles attract applicants from anywhere, so your profile must communicate clarity and ownership fast.</p><h3>What recruiters scan first</h3><ul><li>Direct outcome-driven bullet points.</li><li>Proof of async communication.</li><li>Clear timezone and work preference.</li></ul><blockquote>Show specific outcomes, not generic task lists.</blockquote>',
  ARRAY['Remote Jobs', 'Resume', 'Career Tips'],
  true,
  'published',
  4,
  '2026-04-18T09:00:00Z'
),
(
  'hiring-signals-to-watch-before-you-apply',
  'Hiring Signals to Watch Before You Apply',
  'Use these quick checks to avoid stale listings and focus on real hiring momentum.',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80',
  '<h2>Check recent activity</h2><p>If the role has been open for months with repeated reposts, the team may not be actively hiring.</p><h3>Source quality matters</h3><p>Prioritize company career pages and recently verified listings.</p>',
  ARRAY['Hiring Trends', 'Job Search'],
  false,
  'published',
  3,
  '2026-04-17T12:00:00Z'
);
