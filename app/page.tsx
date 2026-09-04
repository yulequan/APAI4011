import { ArrowRight, BookOpen, Sigma } from 'lucide-react';

const demos = [
  {
    title: 'Gradient Descent, Step by Step',
    description:
      'Edit the feature values, inspect every gradient calculation, and run multiple logistic-regression updates.',
    topic: 'Logistic regression',
    chapter: 'J&M · Section 4.6.3',
    href: './demos/logistic-gradient-descent/',
  },
];

export default function DemoCollection() {
  return (
    <main className="collection-main min-h-screen">
      <header className="collection-header">
        <div className="collection-mark" aria-hidden="true">
          <Sigma />
        </div>
        <div>
          <p className="course-label">APAI4011 · Natural Language Processing</p>
          <h1>Interactive demos</h1>
          <p>
            Small, focused experiments for working through the models and algorithms used in the course.
          </p>
        </div>
      </header>

      <section className="collection-section" aria-labelledby="demo-list-title">
        <div className="collection-section-heading">
          <div>
            <p className="panel-kicker">Demo library</p>
            <h2 id="demo-list-title">Explore a concept</h2>
          </div>
          <span>{demos.length} demo</span>
        </div>

        <div className="demo-grid">
          {demos.map((demo, index) => (
            <a className="demo-card" href={demo.href} key={demo.href}>
              <div className="demo-card-topline">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <BookOpen aria-hidden="true" />
              </div>
              <p className="demo-topic">{demo.topic}</p>
              <h3>{demo.title}</h3>
              <p className="demo-description">{demo.description}</p>
              <div className="demo-card-footer">
                <span>{demo.chapter}</span>
                <span className="open-demo">
                  Open demo <ArrowRight aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}

          <div className="demo-card demo-card-placeholder" aria-label="More demos coming soon">
            <div className="demo-card-topline">
              <span>+</span>
            </div>
            <p className="demo-topic">Collection</p>
            <h3>More demos will appear here</h3>
            <p className="demo-description">
              Each new course demo can be added as another card without changing the existing links.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <p>APAI4011 · Interactive teaching materials</p>
      </footer>
    </main>
  );
}
