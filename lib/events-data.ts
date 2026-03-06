export type EventType = "Minor" | "Flagship"

export interface EventContact {
  name: string
  phone: string
}

export interface EventItem {
  name: string
  type: EventType
  /** Optional badge label (e.g. "Grand Hackathon"); when set, shown instead of type. */
  tag?: string
  teamSize: string // e.g. "1", "2", "1 & 2"
  duration: string
  maxParticipants: number
  prize: number // in INR
  /** Display date e.g. "8th April, 2026" */
  date?: string
  /** Short description for the card */
  description?: string
  /** Rules as bullet points (array) or single string (will be split by sentence for display) */
  rules?: string[] | string
  /** Registration fee in INR */
  registrationFee?: number
  /** Contact persons */
  contacts?: EventContact[]
}

export interface DepartmentEvents {
  id: string
  name: string
  fullName?: string
  events: EventItem[]
}

export const departments: DepartmentEvents[] = [
  {
    id: "aiml",
    name: "AIML",
    fullName: "AI & ML",
    events: [
      {
        name: "Reverse Image Prompting",
        type: "Minor",
        teamSize: "2",
        duration: "1 hr",
        maxParticipants: 60,
        prize: 4000,
        date: "8th April, 2026",
        description: "A fast-paced event to translate visual complexity into precise, imaginative descriptions. A high-stakes test of observation and prompt engineering.",
        rules: "Many complex images given to participants (one per round). They get only 5 prompts to recreate the image. Each round: 5 mins to write the prompt; 5 rounds total. No photos of the image using cameras. One keyword per round must be used in prompts. Use only Perchance tool to generate images (tentative). 1 laptop allowed.",
        registrationFee: 60,
        contacts: [
          { name: "Nandan M Naik", phone: "8277202042" },
          { name: "Anantesh G", phone: "9901470297" },
        ],
      },
      {
        name: "Turing test",
        type: "Minor",
        teamSize: "2",
        duration: "1 hr",
        maxParticipants: 100,
        prize: 4000,
        date: "9th April, 2026",
        description: "An interactive software engineering challenge where participants analyze code snippets and pull requests to determine whether they were created by a human or AI. Includes a rapid quiz and a review round.",
        rules: "The event will be conducted in 2 phases. No use of AI tools, internet, or external assistance. Phones allowed only for answering Kahoot (Phase 1). Only provided material can be used for evaluation. Organizer decisions are final.",
        registrationFee: 100,
        contacts: [
          { name: "Noti Gayatri", phone: "9964848456" },
          { name: "Karthik K", phone: "9986755595" },
        ],
      },
    ],
  },
  {
    id: "cy",
    name: "CY",
    fullName: "Cybersecurity",
    events: [
      {
        name: "Escape & Exploit",
        type: "Minor",
        teamSize: "2-4",
        duration: "4 hr",
        maxParticipants: 150,
        prize: 4000,
        date: "8th April, 2026",
        description: "A fast-paced team challenge where participants solve puzzles and decode hidden clues across multiple stages. Each round unlocks the next level through strategic thinking and teamwork.",
        rules: "All rounds must be solved sequentially. Each correct solution unlocks the next stage. Only permitted resources announced by organizers may be used. Cheating, plagiarism, answer sharing, or interference will lead to disqualification. Answers must be submitted through the official platform. Organizer and judge decisions are final.",
        registrationFee: 150,
        contacts: [
          { name: "Chaitanya M", phone: "7019316251" },
          { name: "Aditi Sinha", phone: "8310022396" },
        ],
      },
      {
        name: "ZeroDay Arena",
        type: "Flagship",
        teamSize: "3-4",
        duration: "6 hr",
        maxParticipants: 250,
        prize: 12000,
        date: "9th April, 2026",
        description: "A 6-hour competitive Capture The Flag (CTF) cybersecurity event evaluating practical and analytical skills across multiple domains. Solve real-world inspired challenges, identify vulnerabilities, and uncover hidden flags.",
        rules: "Solve independently — no sharing of hints, solutions, or flags between teams. No outside help — pre-written solutions, online write-ups, or third-party assistance are prohibited. Use only approved tools. Play fair — any attacks, platform abuse, or infrastructure tampering will lead to disqualification. Submit flags as RNS{...} unless otherwise stated.",
        registrationFee: 250,
        contacts: [
          { name: "Mukund V", phone: "7019316251" },
          { name: "Pratiksha Patil", phone: "8310174681" },
        ],
      },
    ],
  },
  {
    id: "cse",
    name: "CSE",
    fullName: "Computer Science",
    events: [
      {
        name: "Code conundrum",
        type: "Minor",
        teamSize: "2",
        duration: "1 hr 30m",
        maxParticipants: 150,
        prize: 4000,
        date: "8th April, 2026",
        description: "A fast-paced coding challenge where teams match problem statements to the correct code snippets. With randomized variables and decoy solutions, participants must analyze logic under time pressure.",
        rules: "No AI tools are allowed. Accuracy and time will determine rankings. Tie-breakers may be applied if required. Participants must follow all instructions given by organizers.",
        registrationFee: 150,
        contacts: [
          { name: "Pranava G Rao", phone: "8310334784" },
          { name: "D Kartikeya", phone: "9482492326" },
        ],
      },
      {
        name: "Tech Escape Quest",
        type: "Minor",
        teamSize: "4",
        duration: "2 hr",
        maxParticipants: 200,
        prize: 4000,
        date: "9th April, 2026",
        description: "A high-intensity technical investigation challenge where participants solve logic, debugging, and puzzles. Teams unlock encrypted clues across multiple rounds to form a master password.",
        rules: "Mobile phones and internet usage are strictly prohibited unless explicitly allowed. External communication during the event is not permitted. Teams must complete all rounds sequentially. Any malpractice will lead to immediate disqualification. Tie-breaking based on completion time of the final round. Judges' decisions are final.",
        registrationFee: 200,
        contacts: [
          { name: "Pruthvi", phone: "6360517123" },
          { name: "Prajna Shetty", phone: "7899583908" },
        ],
      },
      {
        name: "Version Control Wars",
        type: "Minor",
        teamSize: "3-4",
        duration: "2 hr",
        maxParticipants: 150,
        prize: 4000,
        date: "8th April, 2026",
        description: "A high-intensity team challenge simulating real-world software development. Participants debug and stabilize a disorganized repository using structured Git workflows.",
        rules: "Role assignment within the team is mandatory. All work must be done using feature branches only. Direct commits to the main branch are strictly prohibited. All fixes must be submitted through Pull Requests and approved before merging. Rewriting or deleting major parts of the project is not allowed. External repositories or external code cannot be used. AI tools are permitted, but misuse is prohibited. Commit messages must be clear and meaningful. Judges' decisions are final.",
        registrationFee: 150,
        contacts: [
          { name: "Harshith C", phone: "9113553192" },
          { name: "Pranathi S", phone: "9980491398" },
        ],
      },
    ],
  },
  {
    id: "csds",
    name: "CSDS",
    fullName: "Data Science",
    events: [
      {
        name: "Data Decoded: The Ultimate Duo Showdown",
        type: "Minor",
        teamSize: "2",
        duration: "4 hr",
        maxParticipants: 100,
        prize: 4000,
        date: "8th April, 2026",
        description: "A 4-hour Data Science competition testing coordination, logic, visualization, and technical skills across four rounds: Blind Data Cleaning, Relay Coding, Jumbled Jupyter, and Data Pictionary.",
        rules: "Use of AI tools (ChatGPT, Gemini, etc.) is strictly prohibited. Participants must strictly follow their assigned roles and limitations. Viewing restricted screens, prompts, or visual targets is prohibited. Only designated participants may use the keyboard. Communication allowed only when explicitly permitted. All interaction must stop when the buzzer sounds. Only allowed code actions may be performed. Any rule violation may result in immediate disqualification.",
        registrationFee: 100,
        contacts: [{ name: "Ayush Singh", phone: "7722897223" }],
      },
      {
        name: "Kill Switch Protocol",
        type: "Minor",
        teamSize: "2",
        duration: "4 hr",
        maxParticipants: 100,
        prize: 4000,
        date: "8th April, 2026",
        description: "A fast-paced technical cyber-investigation challenge where participants act as data detectives solving a dynamic murder case using structured datasets and SQL.",
        rules: "Use of AI tools is strictly prohibited. Only provided systems and datasets must be used. Any malpractice leads to disqualification.",
        registrationFee: 100,
        contacts: [
          { name: "M S Nithyasree", phone: "9989908470" },
          { name: "Ayush Singh", phone: "7722897223" },
        ],
      },
      {
        name: "Data Royale: The Last Analyst Standing",
        type: "Flagship",
        teamSize: "3-4",
        duration: "6-8 hr",
        maxParticipants: 250,
        prize: 12000,
        date: "9th April, 2026",
        description: "A high-octane, elimination-style data science competition. Teams battle through four increasingly difficult rounds, with the weakest links eliminated at every stage until only the champions remain.",
        rules: "Teams may use Python (Pandas, Scikit-learn, etc.), R, or specialized BI tools. All work must be original. Scoring is final. Once eliminated, teams cannot rejoin. Each team must carry at least two laptops with pre-installed data science environments. Plagiarism or hard-coding results without logical backing leads to immediate disqualification. Specific datasets and scenarios revealed only at the start of their respective rounds.",
        registrationFee: 250,
        contacts: [{ name: "Yash Sharma", phone: "8858593266" }],
      },
    ],
  },
  {
    id: "ece",
    name: "ECE",
    fullName: "Electronics & Communication",
    events: [
      {
        name: "Innovatrium",
        type: "Flagship",
        teamSize: "2-4",
        duration: "6 hr",
        maxParticipants: 250,
        prize: 12000,
        date: "8th April, 2026",
        description: "A flagship, hands-on innovation event where participants design, build, and demonstrate working hardware prototypes. Teams work over 6 hours using embedded systems, sensors, and electronic components. Four tracks: VLSI, Communication, Embedded/IoT, Robotics.",
        rules: "Each team must consist of 3-4 members. No participant can be part of more than one team. Some optimization will be asked for individual teams on spot. Round 1: prelims (online, abstract screening). Round 2: offline, selected teams present on the day.",
        registrationFee: 250,
        contacts: [
          { name: "Himanshu R Rathod", phone: "9035373935" },
          { name: "Bhagyashree Verma", phone: "9741441806" },
        ],
      },
      {
        name: "Embedded escape room",
        type: "Minor",
        teamSize: "2-3",
        duration: "3 hr",
        maxParticipants: 100,
        prize: 4000,
        date: "9th April, 2026",
        description: "An interactive technical challenge where teams solve embedded-system-based puzzles to escape within a given time. Debug code, analyse circuits, and solve logical clues related to microcontrollers and electronics.",
        rules: "Teams must consist of 2-3 members. Maximum 15-20 teams. No team changes after registration. Challenges must be solved in sequence. Internet and external communication strictly prohibited. Only materials provided by organizers may be used. Hints carry a time penalty of 5-10 minutes.",
        registrationFee: 100,
        contacts: [
          { name: "Aishwarya S N", phone: "7892980744" },
          { name: "Ameera Syed", phone: "9945571131" },
        ],
      },
      {
        name: "Bug Buster",
        type: "Minor",
        teamSize: "1-2",
        duration: "3 hr",
        maxParticipants: 100,
        prize: 4000,
        date: "9th April, 2026",
        description: "A competitive debugging event where participants identify and fix errors in embedded programs and electronic logic. Tests understanding of programming concepts, microcontroller architecture, and logical reasoning.",
        rules: "Individual or team of 1-2 members. Maximum 20-25 teams. No internet access or external reference materials. Only IDE/system provided by organizers. Strict adherence to time limits. Submissions after deadline will not be considered.",
        registrationFee: 100,
        contacts: [
          { name: "Vishnu Kaushik S", phone: "9663038822" },
          { name: "Prathika P", phone: "9986526401" },
        ],
      },
    ],
  },
  {
    id: "eee",
    name: "EEE",
    fullName: "Electrical & Electronics",
    events: [
      {
        name: "Electro-Quiz Circuitrix – Technical Quiz & Circuit Challenge",
        type: "Minor",
        teamSize: "2",
        duration: "4-5 hr",
        maxParticipants: 200,
        prize: 4000,
        date: "8th April, 2026",
        description: "A technical event combining theoretical knowledge assessment through a competitive quiz followed by a practical circuitry challenge for UG Electrical and Electronics students.",
        rules: "No electronic gadgets allowed during quiz (except if online quiz mode is officially permitted). Negative marking will be informed before the quiz. Only qualified teams can participate in the circuitry round. Safety precautions must be followed. Judge's decision is final.",
        registrationFee: 200,
        contacts: [
          { name: "Rajesh R", phone: "9980620056" },
          { name: "Vadiraja G P", phone: "7676401880" },
        ],
      },
      {
        name: "Electraforge – The Grid Survival Challenge",
        type: "Flagship",
        teamSize: "3-4",
        duration: "6 hr",
        maxParticipants: 400,
        prize: 12000,
        date: "9th April, 2026",
        description: "A 6-hour hands-on wiring hackathon. Teams design, wire, test, and demonstrate domestic and industrial electrical systems, focusing on protection, automation, safety, and real-time troubleshooting.",
        rules: "Teams must follow all electrical safety protocols. Power supply only after faculty approval. Improper wiring or unsafe practices may lead to disqualification. All wiring must be neatly labeled. Teams must complete within the stipulated time. Judges' decision is final.",
        registrationFee: 400,
        contacts: [
          { name: "B S Channabasavanagouda", phone: "6360364255" },
          { name: "Shreyas K M", phone: "7338057797" },
        ],
      },
    ],
  },
  {
    id: "ise",
    name: "ISE",
    fullName: "Information Science",
    events: [
      {
        name: "Data to Dashboard: SDG Edition",
        type: "Minor",
        teamSize: "1-3",
        duration: "3 hr",
        maxParticipants: 150,
        prize: 4000,
        date: "9th April, 2026",
        description: "A structured data analytics competition where teams analyze SDG-aligned real-world datasets, build insightful dashboards, and present data-driven recommendations within a fixed time limit.",
        rules: "Datasets will be provided; external datasets are allowed. Submission must be completed within the allotted time. Judges' decision is final. Any malpractice leads to disqualification.",
        registrationFee: 150,
        contacts: [
          { name: "Meghana P G", phone: "6364520130" },
          { name: "Sanjana", phone: "9663044903" },
        ],
      },
    ],
  },
  {
    id: "mca",
    name: "MCA",
    fullName: "Master of Computer Applications",
    events: [
      {
        name: "Ideathon Arena",
        type: "Minor",
        teamSize: "2-5",
        duration: "8 hr",
        maxParticipants: 150,
        prize: 7000,
        date: "9th April, 2026",
        description: "A global mini-event where students pitch startup ideas, receive challenge prompts, and transform them into working prototypes. Platform for innovation, networking, and knowledge-sharing with international experts and industry leaders.",
        rules: "Open to undergraduate and postgraduate students worldwide. Valid student ID required. Professionalism and respect are mandatory. Plagiarism or unsafe prototypes lead to disqualification. Teams must adhere to time limits and safety protocols.",
        registrationFee: 150,
        contacts: [
          { name: "Viren Kamboj", phone: "7498485123" },
          { name: "Sanket Shetty", phone: "7892706256" },
        ],
      },
      {
        name: "IoT Nexus",
        type: "Flagship",
        teamSize: "2-5",
        duration: "6 hr",
        maxParticipants: 300,
        prize: 10000,
        date: "8th April, 2026",
        description: "A National IoT innovation challenge where students and professionals showcase projects across Smart Cities, Healthcare, Industrial IoT, Agriculture, Consumer IoT, Cybersecurity, and Cloud Analytics.",
        rules: "Simulations acceptable if hardware is unavailable. Ethical compliance mandatory (especially in Healthcare IoT). Plagiarism or unsafe prototypes lead to disqualification. Judging: Innovation, feasibility, usability, sustainability, and presentation.",
        registrationFee: 300,
        contacts: [
          { name: "Viren Kamboj", phone: "7498485123" },
          { name: "Sanket Shetty", phone: "7892706256" },
        ],
      },
    ],
  },
  {
    id: "mech",
    name: "MECH",
    fullName: "Mechanical",
    events: [
      {
        name: "RC Car Racing",
        type: "Minor",
        teamSize: "2",
        duration: "1 day",
        maxParticipants: 400,
        prize: 10000,
        date: "9th April, 2026",
        description: "A fast-paced competition where participants race standardized remote-controlled cars on designated tracks. Two sessions testing speed, control, and precision.",
        rules: "Minor racing contact allowed; one defensive move permitted. Intentional ramming, zig-zag blocking, cutting the track, or lifting another car prohibited. No personal RC cars; no hardware/software modifications. Cars randomly allotted; exchanges only for verified technical faults. Track cutting or false starts: 5s penalty; rough driving: 10s. Judges' decisions are final.",
        registrationFee: 400,
        contacts: [
          { name: "Krishna K", phone: "9886685859" },
          { name: "Gowtham Kumar K", phone: "9035786537" },
        ],
      },
      {
        name: "Robowars",
        type: "Flagship",
        teamSize: "3-5",
        duration: "1 day",
        maxParticipants: 2500,
        prize: 40000,
        date: "8th April, 2026",
        description: "A high-intensity robotics competition where teams battle custom-built robots up to 15 kg in a controlled arena. Engineering, creativity, and strategy through knockout rounds to an electrifying grand finale.",
        rules: "3–5 members per team; one or more robots; all safe, functional, remote-controlled. Robots ≤15 kg (incl. batteries), electrically powered, onboard batteries ≤36V DC. Allowed: wheeled/tracked, lifters, flippers, spinners, hammers, cutters, wedges, pneumatic/hydraulic (≤50 bar). Prohibited: drones, adhesives, suction/magnets, spraying, fire/explosives, entangling, electrical shock, jamming. Wireless remote with E-stop required. Matches: 3 min active combat; 20 min prep between rounds. Organisers' decisions final.",
        registrationFee: 2500,
        contacts: [
          { name: "Krishna K", phone: "9886685859" },
          { name: "Gowtham Kumar K", phone: "9035786537" },
        ],
      },
    ],
  },
  {
    id: "civil",
    name: "CIVIL",
    fullName: "Civil",
    events: [
      {
        name: "Design. Decide. Dominate",
        type: "Flagship",
        teamSize: "Max 5",
        duration: "1 day",
        maxParticipants: 300,
        prize: 12000,
        date: "9th April, 2026",
        description: "The flagship technical competition of the Civil Engineering Department, testing proficiency in CAD and core civil concepts. Multiple analytical rounds concluding with a final technical showdown.",
        rules: "Open to all Undergraduate Civil Engineering students. Registration must be completed prior to the event. Any form of malpractice will result in disqualification. Judges' decisions are final.",
        registrationFee: 300,
        contacts: [
          { name: "Preksha P", phone: "6362074779" },
          { name: "Vikas C", phone: "8660402532" },
        ],
      },
      {
        name: "Bridge It!",
        type: "Minor",
        teamSize: "upto 4",
        duration: "2-3 hr",
        maxParticipants: 150,
        prize: 12000,
        date: "8th April, 2026",
        description: "A structural design competition where teams conceptualize and construct a model bridge using restricted materials. Evaluation focuses on structural efficiency, innovation, and load-bearing performance.",
        rules: "Open to UG Civil Engineering students up to 3rd year. Only specified materials are allowed. Use of unauthorized materials will result in disqualification. Judges' decisions are final.",
        registrationFee: 150,
        contacts: [
          { name: "Yashaswini N K", phone: "7483464012" },
          { name: "Bharath", phone: "8073355828" },
        ],
      },
    ],
  },
  {
    id: "mba",
    name: "MBA",
    fullName: "Business Administration",
    events: [
      {
        name: "BizNova",
        type: "Flagship",
        teamSize: "1-3",
        duration: "4 hr",
        maxParticipants: 200,
        prize: 10000,
        date: "9th April, 2026",
        description: "A dynamic business quiz showdown focused on entrepreneurship, finance, marketing, startups, economics, and corporate strategy, with live answer reveals and audience engagement. Culminates in an intense round on real-world business scenarios and decision-making.",
        rules: "Quiz master's decision is final.",
        registrationFee: 200,
        contacts: [
          { name: "Pratik Vijay", phone: "9380667543" },
          { name: "Shreeya D", phone: "8792387952" },
        ],
      },
    ],
  },
  {
    id: "gaming",
    name: "GAMING",
    fullName: "Gaming",
    events: [
      {
        name: "Valorant",
        type: "Flagship",
        teamSize: "5",
        duration: "Two days",
        maxParticipants: 350,
        prize: 10000,
        date: "8th and 9th April, 2026",
        description: "A competitive 5v5 tactical shooter tournament. Day 1: Preliminary qualifiers (direct elimination until Top 10). Day 2: Final rounds; losing teams can rejoin for Rs.200 (one re-entry per team at specific stages).",
        rules: "One team per participant. No ESP, bots, auto aimbots, or foul language — immediate disqualification. Map picks allowed. Match mode: Unrated. No third-party applications (e.g. ExitLag).",
        registrationFee: 350,
        contacts: [
          { name: "Yashas P", phone: "8951467265" },
          { name: "Ujjwal Gowda", phone: "8310564643" },
        ],
      },
      {
        name: "Battlegrounds Mobile India (BGMI)",
        type: "Flagship",
        teamSize: "4",
        duration: "5.5 hrs",
        maxParticipants: 350,
        prize: 10000,
        date: "9th April, 2026",
        description: "A high-stakes battle royale tournament. Phase 1: groups, 3 rounds; top 5 squads per group advance by kills and placement. Final Phase: 4 rounds; previous scores reset; only finals performance determines winner.",
        rules: "Squad: 4 players per team. One team per participant. No ESP, bots, auto-aimbots, or third-party apps (e.g. Discord, ExitLag). Foul language or cheats: immediate disqualification. Bring own devices; college Wi-Fi provided. Match mode: Unrated. In-game VC only. No rejoin if disconnected.",
        registrationFee: 350,
        contacts: [
          { name: "Kushal S", phone: "8217022799" },
          { name: "Adithya Singh Rathaur", phone: "8765047369" },
        ],
      },
    ],
  },
  {
    id: "grand-hackathon",
    name: "Grand Hackathon",
    fullName: "Solaris X - Grand Hackathon",
    events: [
      {
        name: "MCP-Based Systems – Engineering Intelligent Systems",
        type: "Flagship",
        tag: "Grand Hackathon",
        teamSize: "2-4",
        duration: "24 hr",
        maxParticipants: 800,
        prize: 120000,
        date: "8th–9th April, 2026",
        description:
          "Build multi-agent, context-aware AI systems that go beyond simple prompts and enable intelligent orchestration powered by MCP and tools.",
        rules:
          "Team size: 2–4 members. All core development must happen within the 24-hour Solaris X window. Frameworks and libraries are allowed; pre-built or previously shipped solutions are not. Teams must be present during evaluation. Team changes after the event begins are not permitted. No refunds in case of cancellation.",
        contacts: [
          { name: "Prarthana", phone: "9731424499" },
          { name: "Pruthvi Raj R", phone: "6360517123" },
          { name: "Meghana", phone: "6364520130" },
        ],
      },
      {
        name: "Developer Tools — Engineering Productivity",
        type: "Flagship",
        tag: "Grand Hackathon",
        teamSize: "2-4",
        duration: "24 hr",
        maxParticipants: 800,
        prize: 120000,
        date: "8th–9th April, 2026",
        description:
          "Create tools that improve how developers build, debug, test, deploy, monitor, and scale software systems.",
        rules:
          "Team size: 2–4 members. All core development must happen within the 24-hour Solaris X window. Frameworks and libraries are allowed; pre-built or previously shipped solutions are not. Teams must be present during evaluation. Team changes after the event begins are not permitted. No refunds in case of cancellation.",
        contacts: [
          { name: "Prarthana", phone: "9731424499" },
          { name: "Pruthvi Raj R", phone: "6360517123" },
          { name: "Meghana", phone: "6364520130" },
        ],
      },
      {
        name: "Agentic AI-Based Automated Systems – Engineering Intelligent Execution",
        type: "Flagship",
        tag: "Grand Hackathon",
        teamSize: "2-4",
        duration: "24 hr",
        maxParticipants: 800,
        prize: 120000,
        date: "8th–9th April, 2026",
        description:
          "Design AI-driven systems that automate real workflows, reduce manual effort, and enable smarter operational processes.",
        rules:
          "Team size: 2–4 members. All core development must happen within the 24-hour Solaris X window. Frameworks and libraries are allowed; pre-built or previously shipped solutions are not. Teams must be present during evaluation. Team changes after the event begins are not permitted. No refunds in case of cancellation.",
        contacts: [
          { name: "Prarthana", phone: "9731424499" },
          { name: "Pruthvi Raj R", phone: "6360517123" },
          { name: "Meghana", phone: "6364520130" },
        ],
      },
    ],
  },
]

export function getDepartmentById(id: string): DepartmentEvents | undefined {
  return departments.find((d) => d.id === id)
}

export function getDepartmentIds(): string[] {
  return departments.map((d) => d.id)
}
