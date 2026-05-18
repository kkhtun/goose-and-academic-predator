export default function KnowledgeChunkCard({ chunk }) {
    if (!chunk) return null;

    const { metadata } = chunk || {};
    const { author, doi } = metadata || {};
    const doiUrl = doi
        ? doi.startsWith("http")
            ? metadata.doi
            : `https://doi.org/${metadata.doi}`
        : null;

    return (
        <div
            style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 8,
                }}
            >
                <div>
                    <div
                        style={{
                            fontWeight: 700,
                            color: "#111827",
                            fontSize: 14,
                        }}
                    >
                        {chunk.sourceTitle || "Untitled source"}
                    </div>

                    {author && (
                        <div
                            style={{
                                color: "#6b7280",
                                fontSize: 12,
                                marginTop: 2,
                            }}
                        >
                            {author}
                        </div>
                    )}

                    {doi && (
                        <div
                            style={{
                                color: "#6b7280",
                                fontSize: 12,
                                marginTop: 2,
                            }}
                        >
                            DOI:{" "}
                            <a
                                href={doiUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {doi}
                            </a>
                        </div>
                    )}

                    <div
                        style={{
                            color: "#6b7280",
                            fontSize: 12,
                            marginTop: 2,
                        }}
                    >
                        Level {chunk.level}
                        {chunk.realm
                            ? ` · RELATED TO ${chunk.realm} REALM`
                            : ""}
                    </div>
                </div>

                <span
                    style={{
                        alignSelf: "flex-start",
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "#eef2ff",
                        color: "#3730a3",
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}
                >
                    {chunk.type}
                </span>
            </div>

            <div
                style={{
                    color: "#374151",
                    fontSize: 14,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                }}
            >
                {chunk.text.toString()}
            </div>
        </div>
    );
}
