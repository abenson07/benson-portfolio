import type {
  CaseStudyCollaboration,
  CaseStudyService,
} from "@/content/work-page-template";

type CaseStudySidebarIntroProps = {
  title: string;
  websiteUrl: string;
  primaryTag: string;
  lead: string;
};

type CaseStudySidebarBodyProps = {
  paragraphs: string[];
  services: CaseStudyService[];
  capabilities: string[];
  collaboration: CaseStudyCollaboration[];
};

type CaseStudySidebarProps = CaseStudySidebarIntroProps &
  CaseStudySidebarBodyProps;

export function CaseStudySidebarIntro({
  title,
  websiteUrl: _websiteUrl,
  primaryTag,
  lead,
}: CaseStudySidebarIntroProps) {
  return (
    <div className="case-study-sidebar__intro">
      <h1 className="case-study-sidebar__title">{title}</h1>

      <div className="case-study-sidebar__actions">
        {/* <a className="case-study-sidebar__cta" href={websiteUrl}>
          Visit Website
          <span aria-hidden className="case-study-sidebar__cta-arrow">
            →
          </span>
        </a> */}
        <span className="case-study-sidebar__tag">{primaryTag}</span>
      </div>

      <p className="case-study-sidebar__lead">{lead}</p>
    </div>
  );
}

export function CaseStudySidebarBody({
  paragraphs,
  services,
  capabilities,
  collaboration,
}: CaseStudySidebarBodyProps) {
  return (
    <>
      <div className="case-study-sidebar__body">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="case-study-sidebar__paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      {services.length > 0 ? (
        <ul className="case-study-services">
          {services.map((service) => (
            <li key={service.label} className="case-study-services__item">
              <span
                className={`case-study-services__icon case-study-services__icon--${service.iconClass}`}
                aria-hidden
              >
                {service.icon}
              </span>
              {service.label}
            </li>
          ))}
        </ul>
      ) : null}

      {capabilities.length > 0 ? (
        <section className="case-study-capabilities">
          <h2 className="case-study-capabilities__heading">Capabilities</h2>
          <ul className="case-study-capabilities__list">
            {capabilities.map((capability) => (
              <li key={capability} className="case-study-capabilities__item">
                {capability}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {collaboration.length > 0 ? (
        <section className="case-study-collaboration">
          <h2 className="case-study-collaboration__heading">Collaboration</h2>
          <ul className="case-study-collaboration__list">
            {collaboration.map((entry) => (
              <li
                key={`${entry.name}-${entry.description}`}
                className="case-study-collaboration__row"
              >
                <span className="case-study-collaboration__name">
                  {entry.name}
                </span>
                {entry.description ? (
                  <span className="case-study-collaboration__description">
                    {entry.description}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}

export function CaseStudySidebar({
  title,
  websiteUrl,
  primaryTag,
  lead,
  paragraphs,
  services,
  capabilities,
  collaboration,
}: CaseStudySidebarProps) {
  return (
    <aside className="case-study-sidebar">
      <CaseStudySidebarIntro
        title={title}
        websiteUrl={websiteUrl}
        primaryTag={primaryTag}
        lead={lead}
      />
      <CaseStudySidebarBody
        paragraphs={paragraphs}
        services={services}
        capabilities={capabilities}
        collaboration={collaboration}
      />
    </aside>
  );
}
