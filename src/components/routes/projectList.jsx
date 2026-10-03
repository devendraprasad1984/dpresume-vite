import { useState } from "react";
import projects from "../../core/projects";

const ProjectList = () => {
  const [openIds, setOpenIds] = useState(() => new Set());

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="dp-projects">
      {projects.map((project, index) => {
        const open = openIds.has(project.id);
        const panelId = `project-panel-${project.id}`;

        return (
          <article
            key={project.id}
            className={`dp-project reveal hover-lift${open ? " is-open" : ""}`}
            style={{ "--stagger": index }}
          >
            <button
              type="button"
              className="dp-project__head"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggle(project.id)}
            >
              <span className="dp-project__meta">
                <span className="dp-project__role">
                  {project.role} @ {project.company}
                </span>
                <span className="dp-project__period">{project.period}</span>
              </span>

              <span className="dp-project__title">{project.title}</span>

              {project.tech.length > 0 && (
                <span className="dp-project__tech">
                  {project.tech.map((item) => (
                    <span className="dp-project__tag" key={item}>
                      {item}
                    </span>
                  ))}
                </span>
              )}

              <span className="dp-project__chevron" aria-hidden="true" />
            </button>

            {project.url && (
              <a
                className="dp-project__visit"
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {"Visit \u2197"}
              </a>
            )}

            <div
              className="dp-project__panel"
              id={panelId}
              role="region"
              aria-hidden={!open}
            >
              <div className="dp-project__panel-inner">
                <p>{project.summary}</p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default ProjectList;
