/* ==========================================================================
   Single source of truth for the whole site.
   Edit this file to update Research / Publications / CV / Teaching / Search.
   Fields marked  TODO:  were not derivable from your papers — fill them in.
   ========================================================================== */

const SITE = {
  name: "JeongHwan Lee",
  // TODO: your exact title, e.g. "Ph.D. Candidate" / "Postdoctoral Researcher"
  role: "Cryptography Researcher",
  affiliation: "Korea University, Seoul",
  email: "hwani0814@korea.ac.kr",
  interests: ["Lattice Cryptography", "Threshold FHE", "Algebraic Number Theory"],
  year: 2025,
  links: {
    // TODO: fill these in; empty strings are hidden automatically.
    scholar: "",
    orcid: "",
    dblp: "",
    github: "",
    eprint: "",
    cvPdf: "" // e.g. "assets/JeongHwan-Lee-CV.pdf"
  }
};

/* --------------------------------------------------------------------------
   Research areas — these map onto objects in the homepage illustration.
   `object` links a card to a clickable thing in the scene (see index.html).
   -------------------------------------------------------------------------- */

const RESEARCH = [
  {
    id: "threshold-fhe",
    object: "chalkboard",
    title: "Threshold Fully Homomorphic Encryption",
    tint: "#7556b3",
    blurb:
      "Distributed decryption for FHE, particularly in the asynchronous setting. " +
      "Secret-sharing based schemes have to reconcile correctness with simulation " +
      "security, and the parameters that follow from those constraints are where " +
      "most of the cost lives.",
    highlights: [
      "Noise growth under distributed decryption",
      "Correctness and simulation-security constraints on parameter choice",
      "Secret sharing for threshold FHE"
    ],
    tags: ["ThFHE", "Secret sharing", "Noise analysis"]
  },
  {
    id: "lattices",
    object: "lattice",
    title: "Lattices & Lattice Reduction",
    tint: "#5d4899",
    blurb:
      "Hard problems on lattices and how far reduction algorithms can actually " +
      "push them — including the LWE variants that show up in deployed FHE, " +
      "structured SIS, and Coppersmith-style small-root methods.",
    highlights: [
      "Variants of LWE arising in fully homomorphic encryption",
      "Reduction against structured SIS instances",
      "Small-root methods and their lattice constructions"
    ],
    tags: ["LWE", "SIS", "BKZ", "Coppersmith", "Module-LLL"]
  },
  {
    id: "cryptanalysis",
    object: "padlock",
    title: "Cryptanalysis & Side Channels",
    tint: "#d99ac1",
    blurb:
      "Breaking things to find out what the security proof was really assuming. " +
      "Leakage and fault models against threshold protocols and lattice- and " +
      "isogeny-based signatures.",
    highlights: [
      "Leakage models for threshold cryptosystems",
      "Power analysis of lattice signatures",
      "Fault attacks on isogeny-based schemes"
    ],
    tags: ["Side-channel", "Fault attacks", "Threshold cryptosystems"]
  },
  {
    id: "signatures",
    object: "temple",
    title: "Threshold Signatures",
    tint: "#65a6dc",
    blurb:
      "Turning single-signer lattice and isogeny signatures into threshold " +
      "protocols, and getting the security notions right — including what happens " +
      "when a protocol restarts.",
    highlights: [
      "Threshold constructions for hash-and-sign signatures",
      "UC security notions for threshold signing",
      "Precision and arithmetic in isogeny-based signatures"
    ],
    tags: ["Threshold signatures", "LIP", "SQIsign", "UC security"]
  },
  {
    id: "number-theory",
    object: "books",
    title: "Algebraic Number Theory",
    tint: "#739b35",
    blurb:
      "The arithmetic underneath the cryptography: reduction theory for modules " +
      "over number fields, and the invariants that control how well module " +
      "lattices reduce.",
    highlights: [
      "Arakelov reduction theory",
      "Invariants of module lattices",
      "Module-LLL and its practical behaviour"
    ],
    tags: ["Arakelov theory", "Module lattices", "Number fields"]
  }
];

/* --------------------------------------------------------------------------
   Publications.

   status: "published" | "submission" | "manuscript" | "report"
   venue:  leave "" while a paper is under review — the UI shows the status
           label instead, so nothing is claimed that is not true.
   -------------------------------------------------------------------------- */

const ME = "JeongHwan Lee";

const PUBLICATIONS = [
  // Nothing is confirmed published yet.
  // Unpublished work lives in publications.private.js, which is gitignored
  // and never deployed. Move an entry here only once it is accepted.
];

const STATUS_LABEL = {
  published:  "Published",
  submission: "Under submission",
  manuscript: "Manuscript",
  report:     "Technical report"
};

const STATUS_ORDER = ["published", "submission", "manuscript", "report"];

/* --------------------------------------------------------------------------
   Teaching  —  TODO: replace with your real courses.
   -------------------------------------------------------------------------- */

const TEACHING = [
  {
    when: "TODO",
    title: "TODO: Course name",
    where: "Korea University",
    role: "Teaching Assistant",
    detail: "Replace this entry in assets/data.js — see the TEACHING array."
  }
];

/* --------------------------------------------------------------------------
   CV
   -------------------------------------------------------------------------- */

const CV = {
  education: [
    {
      when: "TODO",
      title: "TODO: Degree",
      where: "Korea University, Seoul",
      detail: "Fill in from assets/data.js → CV.education"
    }
  ],
  experience: [
    {
      when: "TODO",
      title: "TODO: Position",
      where: "Korea University, Seoul",
      detail: "Fill in from assets/data.js → CV.experience"
    }
  ],
  awards: [
    {
      when: "2025",
      title: "최우수상 (Grand Prize)",
      where: "제10회 암호분석경진대회 · 10th Korea Cryptanalysis Competition",
      detail: ""
    },
    {
      when: "2025",
      title: "우수상 (Excellence Award)",
      where: "제10회 암호분석경진대회 · 10th Korea Cryptanalysis Competition",
      detail: ""
    }
  ],
  service: [
    {
      when: "TODO",
      title: "TODO: Reviewing / service",
      where: "",
      detail: "Fill in from assets/data.js → CV.service"
    }
  ]
};
