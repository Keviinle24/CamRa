// Terms of service text, shown on /terms and in the sign-up/login modals.
const SECTIONS = [
  {
    title: 'Introduction',
    body: 'Welcome to Camra.me! By accessing or using our website and app, you agree to comply with and be bound by these Terms of Service (“TOS”). Please read them carefully. If you do not agree with these terms, you should not use our services.',
  },
  {
    title: 'Account Creation',
    body: 'Yes, users can create accounts. When you create an account, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
  },
  {
    title: 'User-Generated Content',
    body: 'Yes, users can create and/or upload content, including text and images. By submitting content, you grant Camra.me a non-exclusive, royalty-free, worldwide, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the content in connection with our services.',
  },
  {
    title: 'Infringement Notices',
    body: 'If you believe that any content on our site or app infringes your copyright or other intellectual property rights, please notify us at feedback@camra.me. Include a detailed description of the alleged infringement and your contact information.',
  },
  {
    title: 'In-App Purchases',
    body: 'Yes, we offer in-app purchases. These may include digital goods, items, or services available for one-time purchase.',
  },
  {
    title: 'Goods and Services',
    body: 'Yes, users can buy goods, items, or services through our platform. All purchases are one-time payments only.',
  },
  {
    title: 'Subscription Plans',
    body: 'Yes, we offer subscription plans. Subscription plans may renew automatically unless canceled before the renewal date.',
  },
  {
    title: 'Free Trial',
    body: 'Yes, we offer a free trial for certain services. The duration and terms of the free trial will be specified at the time of sign-up.',
  },
  {
    title: 'Proprietary Rights',
    body: 'Yes, our content (logo, visual design, trademarks, etc.) is our exclusive property. You may not use any of our proprietary content without our prior written permission.',
  },
  {
    title: 'Feedback and Suggestions',
    body: 'By submitting feedback or suggestions to us, you agree that we may use this feedback without any compensation or credits given to you.',
  },
  {
    title: 'Promotions, Contests, Sweepstakes',
    body: 'Yes, we may offer promotions, contests, and sweepstakes. These activities will be governed by separate terms and conditions, which will be provided at the time of the event.',
  },
  {
    title: 'Contact Information',
    body: 'If you have any questions regarding these Terms of Service, you can contact us by email at feedback@camra.me.',
  },
  {
    title: 'Changes to Terms of Service',
    body: 'We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms of Service on our website and app. Your continued use of our services after any changes indicates your acceptance of the new terms.',
  },
  {
    title: 'Governing Law',
    body: 'These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which Camra.me operates.',
  },
];

export default function TermsContent() {
  return (
    <div className="legal-content">
      {SECTIONS.map(({ title, body }) => (
        <section key={title}>
          <h3>{title}</h3>
          <p>{body}</p>
        </section>
      ))}
      <p>By using our website and app, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
    </div>
  );
}
