import './AboutPage.css'

export function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-card">
        <h1 className="about-name">
            Created by{' '}
          <a
            href="https://github.com/Ch-alexandra"
            target="_blank"
            rel="noreferrer"
            className="about-link"
          >
            Ch-alexandra
          </a>
        </h1>
        <p className="about-description">
          React app for the{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noreferrer"
            className="about-link"
          >
            RS School React Course
          </a>
          .
        </p>
      </section>
    </main>
  )
}
