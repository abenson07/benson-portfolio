import type {
  CaseStudyAward,
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
  awards: CaseStudyAward[];
};

type CaseStudySidebarProps = CaseStudySidebarIntroProps &
  CaseStudySidebarBodyProps;

export function CaseStudySidebarIntro({
  title,
  websiteUrl,
  primaryTag,
  lead,
}: CaseStudySidebarIntroProps) {
  return (
    <div className="case-study-sidebar__intro">
      <h1 className="case-study-sidebar__title">{title}</h1>

      <div className="case-study-sidebar__actions">
        <a className="case-study-sidebar__cta" href={websiteUrl}>
          Visit Website
          <span aria-hidden className="case-study-sidebar__cta-arrow">
            →
          </span>
        </a>
        <span className="case-study-sidebar__tag">{primaryTag}</span>
      </div>

      <p className="case-study-sidebar__lead">{lead}</p>
    </div>
  );
}

export function CaseStudySidebarBody({
  paragraphs,
  services,
  awards,
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

      {awards.length > 0 ? (
        <section className="case-study-awards">
          <h2 className="case-study-awards__heading">Awards</h2>
          <ul className="case-study-awards__list">
            {awards.map((award) => (
              <li
                key={`${award.name}-${award.category}`}
                className="case-study-awards__row"
              >
                <span className="case-study-awards__name">{award.name}</span>
                <span className="case-study-awards__category">
                  {award.category}
                </span>
                <span className="case-study-awards__year">{award.year}</span>
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
  awards,
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
        awards={awards}
      />
    </aside>
  );
}
