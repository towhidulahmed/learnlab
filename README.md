# LearnLab

An interactive learning platform for **CompTIA Security+ (SY0-701)** and **Linux Administration**. Built with Next.js, Tailwind CSS, and TypeScript — deployed as a fully static site on Firebase Hosting.

**Live:** [https://neurosc1.web.app](https://neurosc1.web.app)

---

## Courses

### CompTIA Security+ SY0-701

- **35 Mock Exams** — 90 questions each, timed, pass/fail scoring (750/900 threshold)
- **Study Guide** — full SY0-701 domain coverage with detailed topic sections
- **Practice Questions** — per-topic drills with instant feedback and explanations
- **Question types:** single-answer, multi-answer, and scenario-based

### Linux Administration

- **28 Study Domains** covering beginner → intermediate → advanced topics
- **332 Practice Questions** across all topics with explanations
- **Interactive Flashcards** — flip-to-reveal format for every topic
- **Comprehensive Study Guides** — commands, tips, and real-world examples

#### Topics by Difficulty

| Level | Topics |
|-------|--------|
| **Beginner** | Linux Fundamentals, Permissions & Ownership, Text Processing, Piping & Redirection, Process Management, Vi/Vim, Shell Environment, Find & Locate, Links & Inodes, Archiving & Compression, Filesystem Hierarchy (FHS) |
| **Intermediate** | Users & Groups, Package Management, Systemd & Services, Cron Scheduling, Networking, SSH, Disk & Storage, Bash Scripting, Logging & Troubleshooting, Hardware & System Info, Boot Process & GRUB |
| **Advanced** | SELinux & AppArmor, Kernel Modules, ACLs, Backup & Recovery, Time/Locale/NTP, Firewall In-Depth (iptables/firewalld/nftables), RAID, Network File Systems (NFS/Samba), Containers (Docker/Podman), Service Configuration, Resource Limits & cgroups |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Firebase Hosting
- **Storage:** Browser localStorage (progress & results)

## Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (static export to /out)
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage (course picker)
│   ├── linux/                      # Linux course pages
│   │   ├── study/                  # Study guide
│   │   ├── flashcards/             # Flashcard viewer
│   │   └── practice/               # Practice exams
│   └── security-plus/              # Security+ course pages
│       ├── study/                  # Study guide
│       ├── practice/               # Topic practice
│       └── mock-tests/             # Full mock exams
├── components/                     # React client components
└── lib/                            # Study data & question banks
    ├── linux-study-data.ts         # 28 domains, flashcards, commands
    ├── linux-questions.ts          # 332 practice questions
    ├── study-data.ts               # Security+ study content
    └── questions.ts                # Security+ question bank
```

## Note

User progress and exam history are stored in **browser localStorage**. Clearing browser data will reset saved progress and results.
