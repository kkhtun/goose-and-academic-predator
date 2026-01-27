const testChunks = [
    {
        topic: "definition",
        difficultyHint: "easy",
        text: "Predatory publishing refers to deceptive academic publishing practices in which journals prioritize profit over scholarly integrity. These publishers often charge authors publication fees without providing proper peer review, editorial oversight, or transparency. Predatory journals may mimic the names or websites of legitimate journals to appear credible. Publishing in such venues can damage an author’s reputation and reduce the visibility and credibility of their research.",
        sourceTitle: "Overview of Predatory Publishing",
    },
    {
        topic: "peer_review",
        difficultyHint: "medium",
        text: "A key warning sign of predatory journals is the absence of a genuine peer review process. Legitimate peer review typically involves independent experts evaluating a manuscript over several weeks. Predatory journals often promise extremely fast publication and may provide little to no reviewer feedback. Acceptance without requested revisions strongly suggests that no meaningful review has occurred.",
        sourceTitle: "Peer Review Practices",
    },
    {
        topic: "impact_factor",
        difficultyHint: "medium",
        text: "Predatory journals frequently advertise fake or misleading impact factors. These metrics may come from organizations that are not recognized by the academic community or may be entirely fabricated. Legitimate impact factors are published by Clarivate in the Journal Citation Reports. Authors should verify any claimed metrics through official sources before submitting their work.",
        sourceTitle: "Journal Metrics and Impact Factors",
    },
    {
        topic: "solicitation_emails",
        difficultyHint: "easy",
        text: "Predatory publishers often send unsolicited emails inviting researchers to submit manuscripts. These emails may use excessive flattery, vague language, or reference unrelated research areas. They often emphasize rapid publication or offer discounts on publication fees. Reputable journals rarely solicit submissions in this manner, especially from researchers outside their scope.",
        sourceTitle: "Predatory Email Tactics",
    },
    {
        topic: "indexing",
        difficultyHint: "hard",
        text: "Legitimate academic journals are typically indexed in trusted databases such as Scopus, Web of Science, or PubMed. Predatory journals may falsely claim to be indexed or use misleading language such as being listed in Google Scholar, which does not evaluate journal quality. Authors should independently verify indexing claims through official database websites.",
        sourceTitle: "Journal Indexing Verification",
    },
    {
        topic: "editorial_board",
        difficultyHint: "medium",
        text: "Predatory journals often list editorial board members without their permission or provide little information about editors’ qualifications. In some cases, the listed editors cannot be verified or do not exist. Legitimate journals clearly identify their editorial board members and their institutional affiliations.",
        sourceTitle: "Editorial Board Transparency",
    },
    {
        topic: "publication_fees",
        difficultyHint: "easy",
        text: "While many legitimate open-access journals charge article processing fees, predatory journals often hide or misrepresent these fees until late in the submission process. They may pressure authors to pay quickly after acceptance. Transparent journals clearly state all fees upfront and explain what services the fees support.",
        sourceTitle: "Publication Fees and Transparency",
    },
    {
        topic: "scope_and_quality",
        difficultyHint: "medium",
        text: "Predatory journals often claim to publish research from an unusually broad range of disciplines, sometimes covering unrelated fields in a single journal. This lack of focus is a warning sign, as reputable journals usually have a clearly defined academic scope and audience.",
        sourceTitle: "Journal Scope and Quality Indicators",
    },
    {
        topic: "author_risks",
        difficultyHint: "easy",
        text: "Publishing in predatory journals can harm researchers by reducing the credibility of their work, limiting discoverability, and damaging professional reputation. Articles published in such journals are often not recognized by institutions, funders, or promotion committees.",
        sourceTitle: "Risks of Predatory Publishing",
    },
    {
        topic: "verification_steps",
        difficultyHint: "medium",
        text: "Researchers can protect themselves from predatory journals by checking journal websites carefully, verifying indexing claims, reviewing editorial boards, and consulting institutional librarians or trusted journal lists. Taking time to evaluate a journal before submission can prevent long-term academic harm.",
        sourceTitle: "How to Verify Journal Legitimacy",
    },
    {
        topic: "definition",
        difficultyHint: "easy",
        text: "Predatory journals operate primarily to collect publication fees rather than to advance scientific knowledge. They often lack transparent publishing policies and may not follow established ethical guidelines. Unlike legitimate journals, they rarely provide long-term archiving or editorial accountability, making published work difficult to verify or access later.",
        sourceTitle: "Understanding Predatory Journals",
    },
    {
        topic: "peer_review",
        difficultyHint: "medium",
        text: "In legitimate academic publishing, peer review is designed to improve research quality through critical feedback. Predatory journals often bypass this process entirely or simulate it with superficial comments. Authors may receive acceptance notifications within days of submission, which is inconsistent with standard scholarly review timelines.",
        sourceTitle: "Peer Review Standards",
    },
    {
        topic: "impact_factor",
        difficultyHint: "medium",
        text: "Some predatory journals display impact factor values that cannot be verified through recognized indexing agencies. These values may be presented without explanation or attributed to obscure organizations. Researchers should confirm impact metrics through official sources such as Journal Citation Reports before trusting such claims.",
        sourceTitle: "Misuse of Impact Metrics",
    },
    {
        topic: "solicitation_emails",
        difficultyHint: "easy",
        text: "Emails from predatory publishers often contain grammatical errors, generic greetings, and exaggerated praise. They may invite submissions for special issues with unrealistic deadlines. These messages are commonly sent in bulk and are not tailored to the recipient’s actual research background.",
        sourceTitle: "Identifying Predatory Invitations",
    },
    {
        topic: "indexing",
        difficultyHint: "hard",
        text: "Some predatory journals claim inclusion in indexing services by listing databases that do not evaluate journal quality. Others may falsely state that they are under review for indexing. Authors should independently search official indexing platforms to confirm whether a journal is legitimately indexed.",
        sourceTitle: "Indexing Claims and Verification",
    },
    {
        topic: "editorial_board",
        difficultyHint: "medium",
        text: "A lack of transparency about editorial leadership is a common trait of predatory journals. Editorial boards may be incomplete, feature scholars without their consent, or list individuals whose credentials cannot be verified. Legitimate journals clearly present editor roles and institutional affiliations.",
        sourceTitle: "Editorial Board Integrity",
    },
    {
        topic: "publication_fees",
        difficultyHint: "easy",
        text: "Predatory journals often emphasize publication fees over scholarly quality. They may advertise low fees to attract submissions and later request additional payments. Transparent journals disclose all charges clearly and explain what services authors receive in return.",
        sourceTitle: "Publication Fee Practices",
    },
    {
        topic: "scope_and_quality",
        difficultyHint: "medium",
        text: "A journal that claims to publish articles across unrelated disciplines, such as medicine, engineering, and social sciences, may lack proper editorial oversight. Reputable journals typically maintain a focused scope that aligns with the expertise of their editorial board.",
        sourceTitle: "Evaluating Journal Scope",
    },
    {
        topic: "author_risks",
        difficultyHint: "easy",
        text: "Authors who publish in predatory journals may find their work excluded from academic evaluations or funding decisions. Because these journals lack credibility, publications within them may not be recognized by hiring committees or academic institutions.",
        sourceTitle: "Consequences of Predatory Publishing",
    },
    {
        topic: "verification_steps",
        difficultyHint: "medium",
        text: "Before submitting a manuscript, researchers should examine the journal’s website, verify indexing claims, review past issues, and consult institutional librarians when in doubt. Taking these steps can help prevent accidental submission to predatory publishers.",
        sourceTitle: "Steps to Verify Journal Legitimacy",
    },
];

const dupTopics = testChunks.map(({ topic }) => topic);
const topics = Array.from(new Set(dupTopics));
console.log("Topics : " + topics);

module.exports = { testChunks };
