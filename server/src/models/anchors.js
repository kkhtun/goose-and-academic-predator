const { REALM_TYPE } = require("../utils/game.util");

const NEGATIVE_ANCHORS = [
    {
        id: "medical_clinical_research",
        label: "Medical or clinical research",
        text: "Clinical or medical research about patients, diseases, treatments, procedures, interventions, diagnosis, symptoms, biological mechanisms, trials, health outcomes, or clinical effectiveness.",
    },
    {
        id: "technical_scientific_research",
        label: "Technical scientific findings",
        text: "Domain-specific scientific research about experiments, measurements, laboratory methods, engineering systems, algorithms, materials, biology, chemistry, physics, or technical results.",
    },
    {
        id: "ordinary_academic_abstract",
        label: "Ordinary academic abstract",
        text: "A normal academic abstract describing research background, methods, results, conclusions, limitations, and implications without focusing on publishing ethics, predatory publishing, or questionable academic practices.",
    },
];

const LEVEL_0_ANCHORS = [
    {
        id: "academic_publishing_system",
        label: "Academic publishing system",
        text: "Scholarly publishing includes journals, conference proceedings, preprint servers, repositories, and different access models. Researchers should understand how publication venues differ in review process, visibility, credibility, and responsibility for quality control.",
    },
    {
        id: "open_access_models",
        label: "Open access publishing models",
        text: "Open access publishing can follow different models such as gold, green, diamond, and hybrid open access. These models differ in who pays, where the work is made available, and how publication costs and access are managed.",
    },
    {
        id: "article_processing_charges",
        label: "Article processing charges and fee transparency",
        text: "Legitimate journals should clearly disclose article processing charges, publication fees, refund policies, and payment conditions before submission. Hidden fees, unclear charges, or pressure to pay can be warning signs of questionable publishing practices.",
    },
    {
        id: "peer_review_process",
        label: "Peer review process",
        text: "A credible peer review process evaluates research quality before publication through qualified reviewers, meaningful critique, clear review policies, and reasonable editorial timelines. Weak, fake, superficial, or unrealistically fast peer review can indicate poor quality control.",
    },
    {
        id: "editorial_oversight",
        label: "Editorial oversight and journal governance",
        text: "Reliable journals have clear editorial oversight, qualified editors, transparent editorial policies, appropriate journal scope, and accountable decision-making. Questionable journals may have vague policies, fake editorial boards, poor scope control, or little evidence of real editorial management.",
    },
    {
        id: "journal_indexing_and_databases",
        label: "Journal indexing and recognized databases",
        text: "Researchers should verify whether a journal is indexed in recognized scholarly databases and directories. Misleading claims about indexing, fake database listings, or confusion between legitimate indexes and promotional lists can misrepresent a journal's credibility.",
    },
    {
        id: "journal_metrics_and_rankings",
        label: "Journal metrics and rankings",
        text: "Journal quality should not be judged only by metrics such as impact factor, CiteScore, SCImago rankings, or other indicators. Misleading metrics, fake impact factors, inflated rankings, or unverifiable journal impact claims can be used to create false legitimacy.",
    },
    {
        id: "publisher_reputation_and_website",
        label: "Publisher reputation and website credibility",
        text: "A trustworthy publisher usually provides clear contact information, transparent policies, accurate journal scope, credible affiliations, professional website content, and verifiable publication practices. Poor websites, vague policies, and unverifiable claims may signal questionable publishing.",
    },
    {
        id: "publication_ethics_and_research_integrity",
        label: "Publication ethics and research integrity",
        text: "Publication ethics includes honest authorship, conflict of interest disclosure, plagiarism prevention, data integrity, correction policies, and responsible editorial decisions. Questionable academic practices undermine trust in research and scholarly communication.",
    },
    {
        id: "reproducibility_and_transparency",
        label: "Reproducibility and transparency",
        text: "High-quality scientific publishing supports reproducibility and transparency through clear methods, accessible data when appropriate, ethical reporting, disclosure of limitations, and transparent research practices that allow others to evaluate or build on the work.",
    },
    {
        id: "publication_pressure",
        label: "Publication pressure and publish-or-perish culture",
        text: "Publication pressure and publish-or-perish culture can push researchers toward rushed submissions, questionable journals, salami slicing, weak peer review, or unethical publication decisions. Researchers should recognize how academic incentives can affect publishing choices.",
    },
    {
        id: "journal_legitimacy_evaluation",
        label: "Evaluating journal legitimacy",
        text: "Researchers can evaluate journal legitimacy by checking peer review policies, editorial board credibility, indexing claims, fee transparency, publisher reputation, journal scope, publication timelines, and whether the journal follows recognized standards of publication ethics.",
    },
];
const LEVEL_1_ANCHORS = [
    {
        id: "predatory_journals_overview",
        label: "Predatory journals and deceptive publishing",
        text: "Predatory journals and deceptive publishers exploit researchers by presenting themselves as legitimate scholarly venues while failing to provide genuine editorial quality control, trustworthy peer review, or responsible publication standards. They often prioritize profit over research integrity.",
    },
    {
        id: "predatory_conferences",
        label: "Predatory and deceptive conferences",
        text: "Predatory or deceptive conferences imitate legitimate academic meetings but often use aggressive invitations, weak or fake review, unclear organizers, overly broad topics, and registration-focused business models. Researchers should distinguish genuine scholarly conferences from scams.",
    },
    {
        id: "hijacked_and_counterfeit_journals",
        label: "Hijacked and counterfeit journals",
        text: "Hijacked or counterfeit journals imitate legitimate journals by copying names, websites, branding, or identifiers in order to mislead researchers into submitting papers or paying fees. These deceptive operations rely on false identity and confusion with real journals.",
    },
    {
        id: "fake_peer_review_and_editorial_deception",
        label: "Fake peer review and editorial deception",
        text: "Some deceptive publishers claim to use peer review or strong editorial standards while actually providing fake, minimal, or non-existent review. Editorial deception may also involve invented processes, false reviewer claims, or misleading assurances about publication quality.",
    },
    {
        id: "fraudulent_editors_and_editorial_boards",
        label: "Fraudulent editors and invented editorial boards",
        text: "Questionable journals may list fake editors, use scholars' names without consent, invent editorial boards, or falsely present editorial authority. Fraudulent editorial identities are a major warning sign when evaluating the legitimacy of a journal or publisher.",
    },
    {
        id: "blacklists_whitelists_and_watchlists",
        label: "Blacklists, whitelists, and journal evaluation lists",
        text: "Researchers sometimes use blacklists, whitelists, watchlists, or journal evaluation resources such as Beall-style lists or Cabells-style services to help assess journal legitimacy. These tools can support decision-making, but they should be used alongside other journal quality checks.",
    },
    {
        id: "predatory_revenue_tactics",
        label: "Predatory revenue tactics",
        text: "Predatory publishers and related scams may use manipulative revenue tactics such as fake publication fees, pressure to pay, unclear charges, nonstandard payment requests, or monetization strategies that value income over editorial quality and research integrity.",
    },
    {
        id: "paper_mills_and_manufactured_research",
        label: "Paper mills and manufactured research outputs",
        text: "Paper mills and related fraudulent services produce or sell manuscripts, authorship positions, fabricated data, or manipulated submissions. These practices undermine scholarly trust and are part of a broader ecosystem of unethical academic and publishing behavior.",
    },
    {
        id: "vanity_and_pseudo_publishing",
        label: "Vanity press and pseudo-publishing",
        text: "Vanity-style or pseudo-publishing models may imitate scholarly publishing while offering limited editorial scrutiny, weak academic standards, or misleading promises of publication. These outlets can appeal to researchers under pressure to publish but often provide little real scholarly value.",
    },
    {
        id: "editorial_misconduct_and_retractions",
        label: "Editorial misconduct, plagiarism, and retractions",
        text: "Editorial misconduct, plagiarism, and poor publication oversight can lead to unreliable research outputs and retractions. Understanding how misconduct affects the scholarly record helps researchers recognize why publication ethics and journal quality control matter.",
    },
];
const LEVEL_2_HEAVEN_ANCHORS = [
    {
        id: "responsible_journal_selection",
        label: "Responsible journal selection",
        text: "Researchers should choose publication venues based on fit, credibility, editorial standards, audience, and ethical publishing practices rather than relying only on prestige, speed, or promises of easy acceptance.",
    },
    {
        id: "author_protection_and_risk_awareness",
        label: "Author protection and publishing risk awareness",
        text: "Authors can protect themselves by checking journal policies, publisher transparency, editorial legitimacy, fee conditions, copyright terms, and warning signs before submitting. Careful evaluation reduces the risk of exploitation by questionable publishers.",
    },
    {
        id: "research_value_over_journal_prestige",
        label: "Research value over journal prestige",
        text: "The value of research depends on the quality, relevance, transparency, and usefulness of the work, not only on the prestige or impact factor of the journal where it appears.",
    },
    {
        id: "responsible_research_impact",
        label: "Responsible research impact",
        text: "Research impact can include scholarly influence, practical usefulness, openness, reproducibility, social value, and responsible citation. Researchers should avoid treating citation counts or journal metrics as the only measure of research quality.",
    },
    {
        id: "fair_data_and_open_science_practices",
        label: "FAIR data and open science practices",
        text: "FAIR data and open science practices support transparency, reuse, verification, and responsible sharing of research outputs. These practices help strengthen trust in scientific communication and reduce reliance on journal prestige alone.",
    },
    {
        id: "researcher_reputation_and_publication_choices",
        label: "Researcher reputation and publication choices",
        text: "A researcher's reputation can be affected by where and how they publish. Publishing in questionable or deceptive venues may harm credibility, while responsible journal selection and ethical publication practices support long-term scholarly trust.",
    },
];
const LEVEL_2_HELL_ANCHORS = [
    {
        id: "consequences_of_predatory_publishing",
        label: "Consequences of publishing in predatory journals",
        text: "Publishing in a predatory or questionable journal can cause financial loss, reduced visibility, damaged credibility, weaker scholarly recognition, and loss of trust in the researcher's work. The consequences may continue even after the author realizes the journal was deceptive.",
    },
    {
        id: "post_publication_damage_control",
        label: "Post-publication damage control",
        text: "After discovering that work was published in a questionable journal, authors may need to document what happened, check publication agreements, preserve communication records, seek institutional advice, and consider whether correction, withdrawal, or retraction options are available.",
    },
    {
        id: "predatory_publishing_financial_harm",
        label: "Financial harm from predatory publishing",
        text: "Predatory publishers may cause financial harm by charging publication fees, using unclear payment processes, requesting money through suspicious channels, or collecting fees without providing legitimate editorial and publishing services.",
    },
    {
        id: "retraction_and_withdrawal_challenges",
        label: "Retraction and withdrawal challenges",
        text: "Removing work from a predatory or questionable journal can be difficult because the publisher may ignore requests, demand additional fees, refuse withdrawal, or leave the article online. Authors should understand that retraction and withdrawal processes may not work like they do in reputable journals.",
    },
    {
        id: "visibility_and_indexing_damage",
        label: "Visibility and indexing damage",
        text: "Work published in a questionable journal may have poor visibility, weak indexing, limited discoverability, or uncertain preservation. Even if the research itself has value, poor venue choice can reduce its reach and scholarly usefulness.",
    },
    {
        id: "credibility_and_trust_after_questionable_publication",
        label: "Credibility and trust after questionable publication",
        text: "Publishing in a questionable venue can affect how others perceive a researcher's judgment, credibility, and contribution to knowledge. Protecting scholarly trust requires recognizing risks early and responding carefully when a problematic publication has already occurred.",
    },
];

const POSITIVE_ANCHORS = [
    ...LEVEL_0_ANCHORS,
    ...LEVEL_1_ANCHORS,
    ...LEVEL_2_HEAVEN_ANCHORS,
    ...LEVEL_2_HELL_ANCHORS,
];

function getAnchor(level, realm) {
    let anchors;
    if (level === 0) {
        anchors = LEVEL_0_ANCHORS;
    } else if (level === 1) {
        anchors = LEVEL_1_ANCHORS;
    } else if (level === 2) {
        anchors =
            realm === REALM_TYPE.HEAVEN
                ? LEVEL_2_HEAVEN_ANCHORS
                : LEVEL_2_HELL_ANCHORS;
    }
    return anchors[Math.floor(Math.random() * anchors.length)];
}

function getRandomAnchor() {
    return POSITIVE_ANCHORS[
        Math.floor(Math.random() * POSITIVE_ANCHORS.length)
    ];
}

module.exports = {
    POSITIVE_ANCHORS,
    NEGATIVE_ANCHORS,
    getRandomAnchor,
    getAnchor,
};
