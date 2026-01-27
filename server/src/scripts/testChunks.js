const orignalChunks = [
    {
        topic: "predatory_publishing",
        difficultyHint: "easy",
        text: "Predatory publishing refers to deceptive academic publishing practices in which journals prioritize profit over scholarly integrity. These outlets often charge authors publication fees without providing legitimate peer review, editorial oversight, or transparency. They may mimic the names or websites of reputable journals to appear credible. Publishing in such venues can damage an author’s academic reputation and limit the visibility and credibility of their research.",
        sourceTitle: "Overview of Predatory Publishing",
    },
    {
        topic: "peer_review_and_quality_control",
        difficultyHint: "medium",
        text: "A major indicator of predatory publishing is the absence of a genuine peer review process. Legitimate peer review involves independent experts critically evaluating a manuscript, often over several weeks or months. Predatory journals frequently promise rapid acceptance and provide little or no reviewer feedback, signaling that meaningful evaluation has not occurred.",
        sourceTitle: "Peer Review Practices",
    },
    {
        topic: "journal_metrics_and_reputation",
        difficultyHint: "medium",
        text: "Predatory journals often advertise fake or misleading impact factors. These metrics may come from unrecognized organizations or be entirely fabricated. Legitimate impact factors are issued by Clarivate through the Journal Citation Reports. Researchers should always verify journal metrics using trusted and official sources.",
        sourceTitle: "Journal Metrics and Impact Factors",
    },
    {
        topic: "predatory_recruitment_tactics",
        difficultyHint: "easy",
        text: "Predatory publishers commonly send unsolicited emails inviting researchers to submit manuscripts. These messages often contain excessive praise, vague references to the recipient’s work, or promises of fast publication. Reputable journals rarely engage in mass email solicitation, especially outside their field of focus.",
        sourceTitle: "Predatory Email Tactics",
    },
    {
        topic: "journal_indexing_and_visibility",
        difficultyHint: "hard",
        text: "Legitimate journals are typically indexed in recognized databases such as Scopus, Web of Science, or PubMed. Predatory journals may falsely claim indexing or misuse terms like 'indexed in Google Scholar,' which does not evaluate journal quality. Authors should always confirm indexing claims through official database websites.",
        sourceTitle: "Journal Indexing Verification",
    },
    {
        topic: "editorial_standards",
        difficultyHint: "medium",
        text: "Predatory journals often lack transparent editorial governance. Editorial board members may be listed without consent, lack verifiable credentials, or be entirely fictitious. In contrast, reputable journals clearly identify editors, their affiliations, and their roles in the review process.",
        sourceTitle: "Editorial Board Transparency",
    },
    {
        topic: "publication_ethics_and_fees",
        difficultyHint: "easy",
        text: "While many legitimate open-access journals charge article processing fees, predatory journals frequently hide or misrepresent these costs. They may demand payment only after acceptance and pressure authors to pay quickly. Ethical journals clearly disclose all fees upfront and explain what services they cover.",
        sourceTitle: "Publication Fees and Transparency",
    },
    {
        topic: "journal_scope_and_quality",
        difficultyHint: "medium",
        text: "Predatory journals often claim to publish research across a wide and unrelated range of disciplines. This lack of focus suggests poor editorial oversight. Legitimate journals usually maintain a clearly defined scope aligned with the expertise of their editorial board and readership.",
        sourceTitle: "Journal Scope and Quality Indicators",
    },
    {
        topic: "academic_risks_and_consequences",
        difficultyHint: "easy",
        text: "Publishing in predatory journals can harm researchers by reducing the credibility of their work, limiting academic recognition, and negatively affecting promotion or funding decisions. Such publications are often excluded from formal evaluations and bibliometric databases.",
        sourceTitle: "Risks of Predatory Publishing",
    },
    {
        topic: "researcher_due_diligence",
        difficultyHint: "medium",
        text: "Researchers can protect themselves by carefully reviewing journal websites, verifying indexing claims, assessing editorial boards, and consulting institutional librarians or trusted journal lists. Taking time to evaluate a journal before submission helps prevent long-term academic harm.",
        sourceTitle: "How to Verify Journal Legitimacy",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "easy",
        text: "Predatory journals exist primarily to collect author fees rather than to disseminate high-quality research. They often lack archiving policies, ethical guidelines, or transparent editorial practices, making their publications unreliable and difficult to verify over time.",
        sourceTitle: "Understanding Predatory Journals",
    },
    {
        topic: "peer_review_and_quality_control",
        difficultyHint: "medium",
        text: "In credible scholarly publishing, peer review serves to improve research quality through critical evaluation. Predatory journals may bypass this process or simulate it with superficial feedback, often issuing acceptance within days—an unrealistic timeline for proper review.",
        sourceTitle: "Peer Review Standards",
    },
    {
        topic: "journal_metrics_and_reputation",
        difficultyHint: "medium",
        text: "Some predatory journals present unverifiable impact metrics or cite obscure ranking systems. Authors should confirm journal influence using recognized tools such as Journal Citation Reports or Scimago Journal Rank.",
        sourceTitle: "Misuse of Impact Metrics",
    },
    {
        topic: "predatory_recruitment_tactics",
        difficultyHint: "easy",
        text: "Emails from predatory publishers frequently include grammatical errors, generic greetings, and exaggerated claims. They may promote special issues with unrealistic deadlines and are often sent in bulk without regard to the recipient’s research area.",
        sourceTitle: "Identifying Predatory Invitations",
    },
    {
        topic: "journal_indexing_and_visibility",
        difficultyHint: "hard",
        text: "Some predatory journals falsely claim inclusion in indexing services or state they are 'under review' indefinitely. Authors should independently verify indexing status directly through official database platforms rather than relying on journal claims.",
        sourceTitle: "Indexing Claims and Verification",
    },
    {
        topic: "editorial_standards",
        difficultyHint: "medium",
        text: "A lack of transparency regarding editorial leadership is a common warning sign. Predatory journals may list editors without credentials or consent, while legitimate journals clearly define editorial responsibilities and institutional affiliations.",
        sourceTitle: "Editorial Board Integrity",
    },
    {
        topic: "publication_ethics_and_fees",
        difficultyHint: "easy",
        text: "Predatory journals often prioritize collecting fees over maintaining scholarly standards. They may advertise low initial costs but later demand additional payments. Ethical journals provide clear fee structures and publishing policies upfront.",
        sourceTitle: "Publication Fee Practices",
    },
    {
        topic: "journal_scope_and_quality",
        difficultyHint: "medium",
        text: "Journals claiming to publish across unrelated disciplines may lack adequate peer reviewers or editorial oversight. Reputable journals typically specialize in a defined academic field and maintain consistent quality standards.",
        sourceTitle: "Evaluating Journal Scope",
    },
    {
        topic: "academic_risks_and_consequences",
        difficultyHint: "easy",
        text: "Publications in predatory journals are often disregarded in hiring, promotion, and funding decisions. This can negatively affect a researcher’s career progression and scholarly reputation.",
        sourceTitle: "Consequences of Predatory Publishing",
    },
    {
        topic: "researcher_due_diligence",
        difficultyHint: "medium",
        text: "Before submitting a manuscript, researchers should verify journal legitimacy, consult librarians or mentors, examine past issues, and confirm indexing status. These steps help ensure research is published in reputable and ethical venues.",
        sourceTitle: "Steps to Verify Journal Legitimacy",
    },
];

const predatoryPublishingChunks = [
    {
        topic: "predatory_publishing",
        difficultyHint: "easy",
        text: "Predatory publishing exploits researchers by presenting itself as legitimate academic publishing while prioritizing profit over scholarship. These publishers often lack transparency, operate with minimal editorial standards, and accept most submissions regardless of quality. Early-career researchers are especially vulnerable due to pressure to publish.",
        sourceTitle: "Introduction to Predatory Publishing",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "easy",
        text: "One common characteristic of predatory journals is the promise of guaranteed or extremely fast publication. Legitimate journals rarely guarantee acceptance, as manuscripts must pass peer review. Claims of publication within days or hours are strong warning signs.",
        sourceTitle: "Recognizing Predatory Behavior",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "medium",
        text: "Predatory publishers often imitate the names of well-known journals or academic societies to appear credible. This practice, known as journal hijacking or name mimicry, can mislead authors into submitting work to illegitimate outlets that closely resemble trusted publications.",
        sourceTitle: "Journal Identity Deception",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "medium",
        text: "Many predatory journals lack clear policies on retractions, corrections, or ethical misconduct. This absence undermines scholarly accountability and allows flawed or fraudulent research to remain permanently available without correction.",
        sourceTitle: "Ethical Gaps in Predatory Publishing",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "medium",
        text: "Predatory publishers often operate large networks of journals under a single organization, rapidly launching new titles with minimal oversight. These journals frequently share identical website layouts, submission systems, and editorial descriptions.",
        sourceTitle: "Predatory Publishing Networks",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "hard",
        text: "Predatory publishing undermines the scholarly record by allowing unverified or low-quality research to circulate freely. This can distort literature reviews, misinform policy decisions, and weaken public trust in scientific communication.",
        sourceTitle: "Impact on Scholarly Communication",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "hard",
        text: "Some predatory journals exploit open-access models by mimicking legitimate open-access practices while ignoring ethical standards such as peer review, data transparency, and long-term digital preservation.",
        sourceTitle: "Misuse of Open-Access Models",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "medium",
        text: "Authors who unknowingly publish in predatory journals may struggle to withdraw their work or republish it elsewhere, as many legitimate journals consider prior publication a violation of submission policies.",
        sourceTitle: "Author Consequences of Predatory Publishing",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "hard",
        text: "The growth of predatory publishing has been linked to systemic academic pressures such as 'publish or perish' cultures, insufficient mentorship, and evaluation systems that prioritize quantity over quality.",
        sourceTitle: "Systemic Drivers of Predatory Publishing",
    },
    {
        topic: "predatory_publishing",
        difficultyHint: "medium",
        text: "Institutions and libraries combat predatory publishing by maintaining journal whitelists, offering researcher training, and promoting responsible publishing practices. Educating researchers remains one of the most effective prevention strategies.",
        sourceTitle: "Institutional Responses to Predatory Publishing",
    },
];

const academicIntegrityChunks = [
    {
        topic: "academic_integrity",
        difficultyHint: "easy",
        text: "Academic integrity refers to the ethical principles that govern scholarly work, including honesty, fairness, responsibility, and respect for intellectual property. Upholding academic integrity ensures that research and learning remain trustworthy and credible.",
        sourceTitle: "Foundations of Academic Integrity",
    },
    {
        topic: "academic_integrity",
        difficultyHint: "easy",
        text: "Common violations of academic integrity include plagiarism, cheating, fabrication of data, and unauthorized collaboration. These actions compromise the validity of academic work and undermine trust in educational systems.",
        sourceTitle: "Types of Academic Misconduct",
    },
    {
        topic: "academic_integrity",
        difficultyHint: "medium",
        text: "Plagiarism can occur intentionally or unintentionally and includes copying text, ideas, or data without proper attribution. Even improper paraphrasing or missing citations may constitute a breach of academic integrity.",
        sourceTitle: "Understanding Plagiarism",
    },
    {
        topic: "academic_integrity",
        difficultyHint: "medium",
        text: "Data fabrication and falsification involve inventing results or altering research data to misrepresent findings. These practices are considered serious ethical violations and can lead to retractions, sanctions, or loss of professional credibility.",
        sourceTitle: "Research Data Ethics",
    },
    {
        topic: "academic_integrity",
        difficultyHint: "medium",
        text: "Maintaining academic integrity requires transparency in research methods, accurate reporting of results, and proper acknowledgment of contributions. Clear documentation allows others to verify and reproduce scholarly work.",
        sourceTitle: "Responsible Research Practices",
    },
    {
        topic: "academic_integrity",
        difficultyHint: "hard",
        text: "Authorship ethics are a key component of academic integrity. All listed authors should have made meaningful contributions to a work, and honorary or ghost authorship violates established scholarly standards.",
        sourceTitle: "Authorship and Contribution Ethics",
    },
    {
        topic: "academic_integrity",
        difficultyHint: "hard",
        text: "Self-plagiarism occurs when authors reuse substantial portions of their previously published work without proper citation or disclosure. Although the author owns the content, this practice can mislead readers and distort the academic record.",
        sourceTitle: "Self-Plagiarism and Redundant Publication",
    },
    {
        topic: "academic_integrity",
        difficultyHint: "medium",
        text: "Academic institutions promote integrity through honor codes, ethics training, and clear misconduct policies. These frameworks help establish shared expectations and provide procedures for addressing violations.",
        sourceTitle: "Institutional Integrity Policies",
    },
    {
        topic: "academic_integrity",
        difficultyHint: "hard",
        text: "Violations of academic integrity can have long-term consequences, including retracted publications, damaged reputations, loss of funding, and disciplinary action. These outcomes highlight the importance of ethical conduct throughout a research career.",
        sourceTitle: "Consequences of Academic Misconduct",
    },
    {
        topic: "academic_integrity",
        difficultyHint: "medium",
        text: "Promoting a culture of academic integrity involves education, mentorship, and transparent evaluation practices. When institutions emphasize ethical behavior over performance metrics, misconduct becomes less likely.",
        sourceTitle: "Building a Culture of Integrity",
    },
];

const peerReviewChunks = [
    {
        topic: "peer_review",
        difficultyHint: "easy",
        text: "Peer review is a quality control process in which experts in a relevant field evaluate a manuscript before publication. Its purpose is to assess the validity, originality, and significance of research before it enters the scholarly record.",
        sourceTitle: "Introduction to Peer Review",
    },
    {
        topic: "peer_review",
        difficultyHint: "easy",
        text: "In most academic fields, peer review is anonymous, meaning reviewers do not know the identity of the authors and vice versa. This practice is intended to reduce bias and promote objective evaluation.",
        sourceTitle: "Anonymity in Peer Review",
    },
    {
        topic: "peer_review",
        difficultyHint: "medium",
        text: "There are several models of peer review, including single-blind, double-blind, and open review. Each model has advantages and limitations related to transparency, bias, and accountability.",
        sourceTitle: "Models of Peer Review",
    },
    {
        topic: "peer_review",
        difficultyHint: "medium",
        text: "Peer reviewers are expected to evaluate research rigor, methodology, originality, and ethical compliance. Their feedback helps authors improve clarity, accuracy, and scholarly value before publication.",
        sourceTitle: "Role of Peer Reviewers",
    },
    {
        topic: "peer_review",
        difficultyHint: "medium",
        text: "Delays in the peer review process are common due to the voluntary nature of reviewing and the need for multiple expert evaluations. However, unusually fast reviews may indicate inadequate or nonexistent review procedures.",
        sourceTitle: "Peer Review Timelines",
    },
    {
        topic: "peer_review",
        difficultyHint: "hard",
        text: "Conflicts of interest can compromise the integrity of peer review. Reviewers must disclose relationships or biases that could affect their judgment and recuse themselves when necessary.",
        sourceTitle: "Ethics in Peer Review",
    },
    {
        topic: "peer_review",
        difficultyHint: "hard",
        text: "Peer review is not designed to detect all forms of misconduct, such as data fabrication or image manipulation. It functions best as a quality filter rather than a guarantee of research integrity.",
        sourceTitle: "Limitations of Peer Review",
    },
    {
        topic: "peer_review",
        difficultyHint: "medium",
        text: "Constructive peer review focuses on improving a manuscript rather than criticizing the author. Effective reviews provide clear reasoning, actionable feedback, and professional tone.",
        sourceTitle: "Best Practices for Reviewers",
    },
    {
        topic: "peer_review",
        difficultyHint: "hard",
        text: "Open peer review, where reviewer identities or reports are published, aims to increase transparency and accountability. However, it may also discourage critical feedback in sensitive research areas.",
        sourceTitle: "Open Peer Review Models",
    },
    {
        topic: "peer_review",
        difficultyHint: "medium",
        text: "Editors play a central role in peer review by selecting qualified reviewers, interpreting reports, and making final publication decisions. Their judgment helps balance reviewer input and editorial standards.",
        sourceTitle: "Editorial Decision-Making",
    },
];

const researchEthicsChunks = [
    {
        topic: "research_ethics",
        difficultyHint: "easy",
        text: "Research ethics refers to the principles that guide responsible and honest conduct in the planning, execution, and reporting of research. These principles help protect participants, ensure data integrity, and maintain public trust in scholarly work.",
        sourceTitle: "Introduction to Research Ethics",
    },
    {
        topic: "research_ethics",
        difficultyHint: "easy",
        text: "Ethical research requires honesty in data collection, analysis, and reporting. Researchers must present findings truthfully and avoid misleading interpretations or selective reporting of results.",
        sourceTitle: "Honesty in Research",
    },
    {
        topic: "research_ethics",
        difficultyHint: "medium",
        text: "Informed consent is a foundational ethical requirement when conducting research involving human participants. Participants must understand the purpose of the study, potential risks, and their right to withdraw at any time without penalty.",
        sourceTitle: "Informed Consent Principles",
    },
    {
        topic: "research_ethics",
        difficultyHint: "medium",
        text: "Research involving human or animal subjects typically requires approval from an ethics review board or institutional review board (IRB). These bodies evaluate potential risks and ensure ethical standards are met before research begins.",
        sourceTitle: "Ethics Review and Oversight",
    },
    {
        topic: "research_ethics",
        difficultyHint: "medium",
        text: "Conflicts of interest arise when personal, financial, or professional relationships may influence research decisions. Ethical practice requires full disclosure of such conflicts to maintain transparency and credibility.",
        sourceTitle: "Conflicts of Interest in Research",
    },
    {
        topic: "research_ethics",
        difficultyHint: "hard",
        text: "Data management is a critical ethical responsibility. Researchers must store data securely, protect participant confidentiality, and retain records in accordance with institutional and legal requirements.",
        sourceTitle: "Ethical Data Management",
    },
    {
        topic: "research_ethics",
        difficultyHint: "hard",
        text: "Dual-use research presents ethical challenges when findings intended for beneficial purposes could also be misused. Researchers must consider potential harms and follow guidelines to mitigate misuse.",
        sourceTitle: "Dual-Use Research Concerns",
    },
    {
        topic: "research_ethics",
        difficultyHint: "medium",
        text: "Ethical collaboration requires clear agreements on roles, authorship, and data ownership. Misunderstandings in collaborative research can lead to disputes or ethical breaches if expectations are not defined early.",
        sourceTitle: "Ethics of Research Collaboration",
    },
    {
        topic: "research_ethics",
        difficultyHint: "hard",
        text: "Failure to follow ethical research standards can result in serious consequences, including retraction of publications, loss of funding, legal action, and long-term damage to professional reputation.",
        sourceTitle: "Consequences of Ethical Violations",
    },
    {
        topic: "research_ethics",
        difficultyHint: "medium",
        text: "Ethical research practice is an ongoing responsibility that extends beyond compliance. Continuous education, reflection, and adherence to professional guidelines help maintain integrity throughout a research career.",
        sourceTitle: "Sustaining Ethical Research Practice",
    },
];

const testChunks = [
    ...predatoryPublishingChunks,
    ...peerReviewChunks,
    ...researchEthicsChunks,
    ...academicIntegrityChunks,
];
const dupTopics = testChunks.map(({ topic }) => topic);
const topics = Array.from(new Set(dupTopics));
console.log("Topics : " + topics);

module.exports = { testChunks };
