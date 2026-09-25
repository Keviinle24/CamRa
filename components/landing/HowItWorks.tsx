import styles from './Landing.module.scss';

const STEPS = [
  {
    icon: 'bi-envelope-check',
    title: 'Connect',
    body: 'Sign up with your university email. Only verified students can join a chat.',
  },
  {
    icon: 'bi-people',
    title: 'Meet',
    body: "Add a few interests and we'll try to pair you with someone who shares one.",
  },
  {
    icon: 'bi-chat-heart',
    title: 'Chat',
    body: 'Jump into a live video chat. Not feeling it? Hit Next to meet someone new.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: 640 }}>
          <p className="eyebrow mb-2">How it works</p>
          <h2 className="display-5 fw-bold">
            Meet someone new in <span className="text-gradient">three steps</span>
          </h2>
        </div>
        <div className="row g-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="col-md-4">
              <article className={`glass-card h-100 ${styles.step}`}>
                <div className={styles.stepIcon}>
                  <i className={`bi ${step.icon}`} aria-hidden />
                </div>
                <p className={styles.stepNumber}>0{index + 1}</p>
                <h3 className="h4 mb-2">{step.title}</h3>
                <p className="text-body-secondary mb-0">{step.body}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
