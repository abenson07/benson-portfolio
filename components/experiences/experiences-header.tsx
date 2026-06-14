import { TopNav } from "@/components/home/top-nav";

type ExperiencesHeaderProps = {
  hero: {
    lead: string;
    emphasis: string;
  };
};

export function ExperiencesHeader({ hero }: ExperiencesHeaderProps) {
  return (
    <header className="experiences-header">
      <TopNav />
      <div className="experiences-header__hero">
        <p className="experiences-header__lead">{hero.lead}</p>
        <h1 className="experiences-header__emphasis">{hero.emphasis}</h1>
      </div>
    </header>
  );
}
