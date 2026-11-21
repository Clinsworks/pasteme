import { Link } from "react-router-dom";
import Icon from "./Icon";
import { getCategoryLabel } from "../lib/categoryLabels";
import { formatMoney } from "../lib/money";
import "./PasteCard.css";

function getCreatorName(paste) {
  return paste.creator?.displayName
    || paste.creator?.name
    || paste.creatorName
    || paste.owner?.displayName
    || paste.owner?.name
    || "";
}

function getUniversity(paste) {
  return paste.university
    || paste.creatorUniversity
    || paste.creator?.university
    || paste.owner?.university
    || "";
}

export default function PasteCard({ paste, language = "en", labels }) {
  const id = paste?.id || paste?._id;
  if (!id) return null;

  const title = paste.title || labels.untitled;
  const story = (paste.shortDescription || paste.summary || paste.story || "").trim();
  const creatorName = getCreatorName(paste);
  const university = getUniversity(paste);
  const hasRaised = paste.raised !== null && paste.raised !== undefined;
  const raised = Number(paste.raised) || 0;
  const target = Number(paste.target);
  const hasGoal = paste.target !== null
    && paste.target !== undefined
    && paste.target !== ""
    && Number.isFinite(target)
    && target > 0;
  const hasContributors = paste.contributors !== null && paste.contributors !== undefined;
  const progress = hasGoal ? Math.min((raised / target) * 100, 100) : 0;

  return (
    <article className="paste-card">
      <Link className="paste-card-cover" to={`/c/${encodeURIComponent(id)}`} aria-label={`${labels.view}: ${title}`}>
        {paste.coverImage ? (
          <img src={paste.coverImage} alt="" loading="lazy" />
        ) : (
          <span className="paste-card-cover-placeholder" aria-hidden="true">
            <Icon name="heart-handshake" size={30} />
          </span>
        )}
        <span className="paste-card-category">{getCategoryLabel(paste.category, language)}</span>
      </Link>

      <div className="paste-card-body">
        <div className="paste-card-byline">
          {creatorName && <span>{labels.by} {creatorName}</span>}
          {university && <span><Icon name="map-pin" size={13} />{university}</span>}
        </div>

        <h3><Link to={`/c/${encodeURIComponent(id)}`}>{title}</Link></h3>
        {story && <p className="paste-card-story">{story}</p>}

        <div className="paste-card-funding">
          <div className="paste-card-raised-row">
            <div>
              <strong>{hasRaised ? formatMoney(raised, paste.currency || "NGN", paste.assetScale) : "—"}</strong>
              <span>{labels.raised}</span>
            </div>
            {hasGoal ? (
              <div className="paste-card-goal">
                <strong>{formatMoney(target, paste.currency || "NGN", paste.assetScale)}</strong>
                <span>{labels.goal}</span>
              </div>
            ) : (
              <div className="paste-card-goal">
                <strong>{labels.noGoal}</strong>
                <span>{labels.goal}</span>
              </div>
            )}
          </div>

          {hasGoal && (
            <>
              <div className="paste-card-progress" role="progressbar" aria-label={labels.progress} aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100">
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="paste-card-progress-meta">
                <span>{Math.round(progress)}% {labels.funded}</span>
                {hasContributors && <span>{Number(paste.contributors).toLocaleString()} {labels.supporters}</span>}
              </div>
            </>
          )}
          {!hasGoal && hasContributors && (
            <div className="paste-card-progress-meta paste-card-no-goal-meta">
              <span>{Number(paste.contributors).toLocaleString()} {labels.supporters}</span>
            </div>
          )}
        </div>

        <div className="paste-card-actions">
          <Link className="paste-card-view" to={`/c/${encodeURIComponent(id)}`}>
            {labels.view}<Icon name="arrow-up-right" size={15} />
          </Link>
          <Link className="paste-card-support" to={`/c/${encodeURIComponent(id)}/donate`}>
            {labels.contribute}
          </Link>
        </div>
      </div>
    </article>
  );
}
