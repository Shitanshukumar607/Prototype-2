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
  /** When false, registrations are closed for this event. Defaults to open if omitted. */
  registrationOpen?: boolean
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
        duration: "2 hr",
        maxParticipants: 60,
        prize: 5000,
        date: "8th April, 2026",
        description: "A fast-paced challenge to turn complex visuals into precise prompts.",
        rules: "Many complex images are given to the participants (one per round). They get only 5 prompts to recreate the image. Each round consists of 5 minutes to write the prompt (5 rounds). No photos may be taken of the image using cameras. For every round, one keyword is given to the participants and they must use it in their prompts in that round. Use only the Perchance tool to generate images (tentative). 1 laptop allowed.",
        registrationFee: 60,
        contacts: [
          { name: "Nandan M Naik", phone: "8277202042" },
          { name: "Anantesh G", phone: "9901470297" },
        ],
      },
      {
        name: "Turing Test",
        type: "Minor",
        teamSize: "2",
        duration: "1 hr",
        maxParticipants: 100,
        prize: 5000,
        date: "9th April, 2026",
        description: "An interactive challenge to spot whether code and pull requests are human-written or AI-generated, combining a rapid quiz with a detailed review round.",
        rules: "The event will be conducted in two phases. No use of AI tools, internet, or external assistance. Phones are allowed only for answering Kahoot (Phase 1). Only the provided material may be used for evaluation. Organizers' decisions are final in case of disputes.",
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
        duration: "5 hr",
        maxParticipants: 150,
        prize: 5000,
        date: "8th April, 2026",
        description: "A fast-paced team challenge where participants solve puzzles and decode clues through strategy and teamwork.",
        rules: "All rounds must be solved sequentially. Each correct solution unlocks the next stage. Only permitted resources announced by organizers may be used. Cheating, plagiarism, answer sharing, or interference will lead to disqualification. Answers must be submitted through the official platform provided. The event will run within a fixed time limit. Organizers' and judges' decisions are final.",
        registrationFee: 150,
        contacts: [
          { name: "Chaitanya M", phone: "7019316251" },
          { name: "Aditi Sinha", phone: "8310022396" },
        ],
      },
      {
        name: "ZeroDay Arena",
        type: "Flagship",
        teamSize: "1-4",
        duration: "6 hr",
        maxParticipants: 250,
        prize: 20000,
        date: "9th April, 2026",
        description: "A 6-hour CTF cybersecurity challenge to solve real-world problems, identify vulnerabilities, and uncover hidden flags.",
        rules: "Solve independently - No sharing of hints, solutions, or flags between teams. No outside help - Pre-written solutions, online write-ups, or third-party assistance are prohibited. Personal Laptops must be brought with chargers. Use only approved tools - external tools are not allowed unless authorized. Play fair - Any attacks, platform abuse, or infrastructure tampering will lead to disqualification. Follow the flag format - Submit flags as RNS{...} unless otherwise stated.",
        registrationFee: 250,
        contacts: [
          { name: "Mukund V", phone: "8431041791" },
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
        name: "Code Conundrum",
        type: "Minor",
        teamSize: "2",
        duration: "1 hr 30 min",
        maxParticipants: 150,
        prize: 5000,
        date: "8th April, 2026",
        description: "A fast-paced coding challenge where teams match problem statements to the correct code snippets under time pressure.",
        rules: "No AI tools are allowed. Accuracy and time will determine rankings. Tie-breakers may be applied if required. Participants must follow all instructions given by the organizers.",
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
        prize: 5000,
        date: "9th April, 2026",
        description: "A high-intensity challenge where teams solve logic, debugging, and puzzle tasks to unlock encrypted clues and form a master password.",
        rules: "Mobile phones and internet usage are strictly prohibited unless explicitly allowed. External communication during the event is not permitted. Teams must complete all rounds sequentially. Any malpractice will lead to immediate disqualification. Tie-breaking will be based on the completion time of the final round. Judges' decisions are final.",
        registrationFee: 200,
        contacts: [
          { name: "Pruthvi Raj R", phone: "6360517123" },
          { name: "Prajna Shetty", phone: "7899583908" },
        ],
      },
      {
        name: "Version Control Wars",
        type: "Minor",
        teamSize: "3-4",
        duration: "2 hr",
        maxParticipants: 150,
        prize: 5000,
        date: "8th April, 2026",
        description: "A high-intensity team challenge simulating real-world development using Git to debug and stabilize a chaotic repository.",
        rules: "Role assignment within the team is mandatory. All work must be done using feature branches only. Direct commits to the main branch are strictly prohibited. All fixes must be submitted through Pull Requests and approved before merging. Rewriting or deleting major parts of the project is not allowed. External repositories or external code cannot be used. AI tools are permitted, but misuse is prohibited. Commit messages must be clear and meaningful. All tasks must be completed within the allotted time. Judges' decisions are final.",
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
        duration: "3 hr",
        maxParticipants: 100,
        prize: 5000,
        date: "8th April, 2026",
        description: "A 4-hour data science competition testing analytical and technical skills across four rounds: Blind Data Cleaning, Relay Coding, Jumbled Jupyter, and Data Pictionary.",
        rules: "Use of AI tools (ChatGPT, Gemini, etc.) is strictly prohibited. Participants must strictly follow their assigned roles and limitations. Viewing restricted screens, prompts, or visual targets is prohibited. Only designated participants may use the keyboard at any time. Communication is allowed only when explicitly permitted. All interaction must stop immediately when the buzzer sounds. Only allowed code actions (e.g., rearranging) may be performed - no unauthorized additions or edits. Any rule violation may result in immediate disqualification.",
        registrationFee: 100,
        contacts: [
          { name: "Yash Sharma", phone: "7722897223" },
          { name: "Srushti B S", phone: "9663399759" }
        ],
      },
      {
        name: "Kill Switch Protocol",
        type: "Minor",
        teamSize: "2",
        duration: "4 hr",
        maxParticipants: 100,
        prize: 5000,
        date: "8th April, 2026",
        description: "A fast-paced cyber investigation challenge where participants solve a murder case using datasets and SQL.",
        rules: "Use of AI tools (ChatGPT, Gemini, etc.) is strictly prohibited. Only provided systems and datasets must be used. Any malpractice leads to disqualification. Team must have exactly 2 participants.",
        registrationFee: 100,
        contacts: [
          { name: "M S Nithyasree", phone: "9573883324" },
          { name: "M Kruthika", phone: "9989908470" },
        ],
      },
      {
        name: "Data Royale: The Last Analyst Standing",
        type: "Flagship",
        teamSize: "3-4",
        duration: "6 hr",
        maxParticipants: 250,
        prize: 20000,
        date: "9th April, 2026",
        description: "A high-octane elimination-style data science competition across four rounds, where the weakest teams are eliminated each stage.",
        rules: "Teams may use Python (Pandas, Scikit-learn, etc.), R, or specialized BI tools. All work must be original. Scoring is final. Once a team is eliminated, they cannot rejoin the competition. Each team must carry at least two laptops with pre-installed data science environments. Any form of plagiarism or \"hard-coding\" results without logical backing will lead to immediate disqualification. Specific datasets and final scenarios will only be revealed at the start of their respective rounds.",
        registrationFee: 250,
        contacts: [
          { name: "Ayush Singh", phone: "8858932664" },
          { name: "Prem Kumar", phone: "9059480205" }
        ],
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
        teamSize: "3-4",
        duration: "6 hr",
        maxParticipants: 250,
        prize: 30000,
        date: "8th April, 2026",
        description: "A flagship hands-on innovation event where teams design and demonstrate hardware prototypes using embedded systems, sensors, and electronics across themed tracks.",
        rules: "Each team must consist of 3-4 members. No participant can be part of more than one team. Abstract submission (online). Presentation (offline).",
        registrationFee: 500,
        contacts: [
          { name: "Himanshu R Rathod", phone: "9035373935" },
          { name: "Bhagyashree Verma", phone: "9741441806" },
        ],
      },
      {
        name: "Embedded Escape Room",
        type: "Minor",
        teamSize: "2-3",
        duration: "3 hr",
        maxParticipants: 100,
        prize: 5000,
        date: "9th April, 2026",
        description: "An interactive embedded-systems challenge where teams debug code, analyze circuits, and solve puzzles involving microcontrollers and electronics within a time limit.",
        rules: "Team Structure: Teams must consist of 2-3 members. No team changes after registration. Gameplay rules: Challenges must be solved in sequence. Internet access and external communication are strictly prohibited. Only materials provided by the organizers may be used. Hints & Penalties: Teams may request hints. Each hint carries a time penalty. Excessive hint usage may affect ranking.",
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
        duration: "2 hr 30 min",
        maxParticipants: 100,
        prize: 5000,
        date: "9th April, 2026",
        description: "A competitive debugging challenge to identify and fix errors in embedded programs and electronic logic, testing programming and microcontroller concepts.",
        rules: "Participation: Individual or team of 1–2 members allowed. No team changes. Allowed Materials: No internet access. No external reference materials. Only IDE/system provided by the organizers. Time Rules: Strict adherence to time limits.",
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
        duration: "6 hr",
        maxParticipants: 200,
        prize: 5000,
        date: "8th April, 2026",
        description: "A technical event with a quiz and practical circuitry challenge for Electrical and Electronics students.",
        rules: "No electronic gadgets are allowed during the quiz (except if online quiz mode is officially permitted). Negative marking will be informed before the quiz based on the number of registrations. Only qualified teams can participate in the circuitry round. Safety precautions must be followed during the circuit implementation. Judges' decisions are final and binding.",
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
        prize: 15000,
        date: "9th April, 2026",
        description: "A 6-hour hands-on wiring hackathon to design and test domestic and industrial electrical systems with safety and automation.",
        rules: "Teams must follow all electrical safety protocols. Power supply will be given only after faculty approval. Improper wiring or unsafe practices may lead to disqualification. All wiring must be neatly labeled. Teams must complete within the stipulated time. Any damage to equipment due to negligence will lead to a penalty. The judges' decision will be final and binding.",
        registrationFee: 400,
        contacts: [
          { name: "B S Channabasavana gouda", phone: "6360364255" },
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
        prize: 5000,
        date: "9th April, 2026",
        description: "A data analytics competition where teams analyze SDG-aligned datasets, create insightful dashboards, and present data-driven recommendations within a fixed time.",
        rules: "Datasets will be provided, although external datasets are allowed. Submission must be completed within the allotted time. The judges' decision is final. Any malpractice leads to disqualification.",
        registrationFee: 150,
        contacts: [
          { name: "Shreya D", phone: "9113916213" },
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
        duration: "6 hr",
        maxParticipants: 150,
        prize: 7000,
        date: "9th April, 2026",
        description: "A global mini-event where students pitch startup ideas, tackle challenge prompts, and build working prototypes while connecting with international experts and industry leaders.",
        rules: "Open to undergraduate and postgraduate students. Teams of 2–5 members; valid student ID required. Professionalism and respect are mandatory. Plagiarism or unsafe prototypes lead to disqualification. Teams must adhere to time limits and safety protocols. Teams must bring their own laptops and necessary software tools required for ideation and prototype development. Participants must carry a valid college ID card during the event for verification.",
        registrationFee: 150,
        contacts: [
          { name: "Sanket Shetty", phone: "7892706256" },
          { name: "Bhargavi Gangoor", phone: "9945944055" },
        ],
      },
      {
        name: "IoT Nexus",
        type: "Flagship",
        teamSize: "2-5",
        duration: "6 hr",
        maxParticipants: 300,
        prize: 15000,
        date: "8th April, 2026",
        description: "A national IoT innovation challenge where participants showcase projects in Smart Cities, Healthcare, Industry, Agriculture, Cybersecurity, and Cloud Analytics.",
        rules: "Ethical compliance mandatory (especially in Healthcare IoT). Plagiarism or unsafe prototypes lead to disqualification. Judging criteria: Innovation, feasibility, usability, sustainability, and presentation. Teams must bring their own laptops, hardware components, and required software. Projects should be original work developed by the team members. Drone-based projects are allowed; however, drone demonstrations must follow safety guidelines and may be limited to controlled or simulation-based demonstrations within the venue.",
        registrationFee: 300,
        contacts: [
          { name: "Viren Kamboj", phone: "7498485123" },
          { name: "Amrutha M", phone: "9611328555" },
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
        duration: "6 hr",
        maxParticipants: 400,
        prize: 12000,
        date: "9th April, 2026",
        description: "A fast-paced race where participants compete with standardized RC cars on a track, testing speed, control, and precision.",
        rules: "Minor racing contact is allowed, but only one defensive move is permitted. Intentional ramming, zig-zag blocking, cutting the track, or lifting another car is prohibited. No personal RC cars are allowed; hardware or software modifications are strictly forbidden. Cars will be randomly allotted before each round, and exchanges are permitted only for verified technical faults. Track cutting or false starts incur a 5-second penalty; rough driving adds 10 seconds. Repeated offences lead to disqualification; car tampering results in immediate disqualification. Cars may only be activated in designated areas. Only drivers may enter the control zone; support members must remain in the pit area. No running inside the track during races. Judges' decisions are final.",
        registrationFee: 400,
        contacts: [
          { name: "Krishna K", phone: "9886685859" },
          { name: "Sanchith H S", phone: "7760013454" },
        ],
      },
      {
        name: "Robo Wars",
        type: "Flagship",
        teamSize: "3-5",
        duration: "6 hr",
        maxParticipants: 2500,
        prize: 50000,
        date: "8th April, 2026",
        description: "A robotics battle where teams compete with custom-built robots up to 15 kg in an arena through knockout rounds to the finale.",
        rules: "Each team may participate with 3-5 members and one robot, all safe, functional, and fully remote-controlled. Robots must weigh ≤15 kg (including batteries and systems), be electrically powered with onboard batteries ≤36V DC, and fit safely inside the arena. Allowed designs include wheeled or tracked robots, lifters, flippers, spinners, hammers, cutters, wedges, and pneumatic/hydraulic systems (≤50 bar, leak-proof). Prohibited features include drones, adhesives, suction/magnets, liquid/gas spraying, fire/explosives, entangling devices, electrical shock, or signal jamming. Robots must have a wireless remote with interference-free connection and an emergency stop (E-stop). Batteries must be insulated, secure, and equipped with an accessible main power switch. Teams must place robots in the arena only when instructed and must not touch them once the match begins. A robot is declared out if immobile, stuck, or leaves the arena. Matches last 3 minutes of active combat, with 20 minutes allowed for preparation between rounds. Late or unprepared teams may forfeit. Organisers may extend prep time at their discretion. Teams are responsible for their robot's safety and any damage caused. Organisers are not liable for match damage. Unsafe robots, exposed wiring, banned weapons, or intentional danger will result in disqualification. Each team must register under a unique, appropriate name and appoint a leader as the official contact.",
        registrationFee: 2000,
        contacts: [
          { name: "Nithin H", phone: "9538269998" },
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
        teamSize: "3-5",
        duration: "6 hr",
        maxParticipants: 300,
        prize: 12000,
        date: "9th April, 2026",
        description: "A Civil Engineering competition testing CAD skills and core concepts through analytical rounds leading to a final technical showdown.",
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
        teamSize: "2-4",
        duration: "6 hr",
        maxParticipants: 150,
        prize: 5000,
        date: "8th April, 2026",
        description: "Teams design and build a model bridge using limited materials, judged on structural efficiency, innovation, and load strength.",
        rules: "Open to UG Civil Engineering students up to 3rd year. Only specified materials are allowed. Use of unauthorized materials will result in disqualification. Judges' decisions are final.",
        registrationFee: 200,
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
    fullName: "Business Administration (MBA)",
    events: [
      {
        name: "BizNova",
        type: "Flagship",
        teamSize: "2",
        duration: "4 hr",
        maxParticipants: 200,
        prize: 10000,
        date: "9th April, 2026",
        description: "A fast-paced business quiz on startups, finance, and strategy with live answer reveals, audience engagement, and real-world decision-making rounds.",
        rules: "The quiz format and rounds will be explained at the beginning of the event. Participants are expected to report to the venue at least 15–20 minutes prior to the start of the event. Late entries may not be entertained. The decisions of the Quiz Master and organizing committee are final and binding. Any form of malpractice, including use of mobile phones or unfair means, will lead to immediate disqualification.",
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
        duration: "6 hr (8th April), 5 hr (9th April)",
        maxParticipants: 350,
        prize: 10000,
        date: "8th and 9th April, 2026",
        description: "A competitive 5v5 tactical shooter tournament with Day 1 direct-elimination qualifiers to Top 10 and Day 2 finals featuring a one-time re-entry option for eliminated teams.",
        rules: "One team per participant. No ESP, bots, auto aimbots, or foul language. If used, team will be disqualified immediately. Map picks are allowed. Match mode: Unrated. No third party application including application like exitlag. Losing teams can rejoin the tournament for a Rs.200 fee (Only one re-entry per team at specific stages).",
        registrationFee: 350,
        contacts: [
          { name: "Yashas P", phone: "8951467265" },
          { name: "Ujjwal Gowda", phone: "8310564634" },
        ],
      },
      {
        name: "Battlegrounds Mobile India (BGMI)",
        type: "Flagship",
        teamSize: "4",
        duration: "6 hr",
        maxParticipants: 350,
        prize: 10000,
        date: "9th April, 2026",
        description: "A high-stakes battle royale tournament with 3-round group stages where the top 5 squads advance by kills and placement, followed by a 4-round final where only finals performance determines the winner.",
        rules: "Squad Size: 4 players per team (One team per participant). Fair Play: No ESP, bots, auto-aimbots, or third-party apps (e.g., Discord, ExitLag). Use of foul language or cheats results in immediate disqualification. Device: Participants must bring their own mobile devices and peripherals. College Wi-Fi will be provided. Match Mode: Unrated. In-game voice chat (VC) only. No Rejoin: Disconnected players cannot rejoin during a phase.",
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
        registrationFee: 800,
        contacts: [
          { name: "Prarthana", phone: "9731424499" },
          { name: "Meghana", phone: "6364520130" },
          { name: "Suhan", phone: "9606592647" },
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
        registrationFee: 800,
        contacts: [
          { name: "Prarthana", phone: "9731424499" },
          { name: "Meghana", phone: "6364520130" },
          { name: "Suhan", phone: "9606592647" },
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
        registrationFee: 800,
        contacts: [
          { name: "Prarthana", phone: "9731424499" },
          { name: "Meghana", phone: "6364520130" },
          { name: "Suhan", phone: "9606592647" },
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
