// Learning module content shared by the Awareness list and the ModuleDetail page.
// The `id` is used in the URL: /awareness/:moduleId
const modules = [
  {
    id: 'phishing-awareness',
    icon: '🎣',
    title: 'Phishing Awareness',
    level: 'Beginner',
    duration: '10 min',
    summary: 'Recognize fake emails, messages and websites designed to steal your credentials or money.',
    lessons: [
      {
        heading: 'What is phishing?',
        body: 'Phishing is a message that pretends to come from someone you trust, such as a bank, a delivery company or your university, to trick you into clicking a link, opening an attachment or sharing sensitive information.',
      },
      {
        heading: 'Common warning signs',
        body: 'Urgent or threatening language ("your account will be closed today"), sender addresses that almost match a real domain, unexpected attachments, requests for passwords or OTP codes, and links whose real destination differs from the text shown.',
      },
      {
        heading: 'Beyond email',
        body: 'Phishing also arrives by SMS (smishing), phone calls (vishing), social media messages and QR codes. The same rules apply: verify before you trust.',
      },
    ],
    tips: [
      'Hover over links to preview the real URL before clicking.',
      'Never share passwords or one-time codes, even with "support" staff.',
      'Contact the organization through its official website or app, not the link in the message.',
      'Report suspicious emails to your IT team or email provider.',
    ],
  },
  {
    id: 'password-security',
    icon: '🔑',
    title: 'Password Security',
    level: 'Beginner',
    duration: '8 min',
    summary: 'Create strong, unique passwords and manage them safely across all your accounts.',
    lessons: [
      {
        heading: 'Why reuse is dangerous',
        body: 'When one website is breached, attackers try the leaked email and password on many other sites (credential stuffing). A reused password turns one breach into many compromised accounts.',
      },
      {
        heading: 'What makes a strong password',
        body: 'Length matters most. A passphrase of four or more random words is easier to remember and harder to crack than a short password full of symbols.',
      },
      {
        heading: 'Password managers',
        body: 'A password manager generates and stores a unique password for every site, so you only need to remember one strong master password.',
      },
    ],
    tips: [
      'Use at least 12–16 characters, or a passphrase of random words.',
      'Use a different password for every account.',
      'Store passwords in a reputable password manager.',
      'Turn on two-factor authentication for important accounts.',
    ],
  },
  {
    id: 'device-security',
    icon: '💻',
    title: 'Device Security',
    level: 'Intermediate',
    duration: '12 min',
    summary: 'Keep your laptop and phone protected with updates, locks, encryption and safe app habits.',
    lessons: [
      {
        heading: 'Updates close security holes',
        body: 'Software updates fix vulnerabilities that attackers actively exploit. Delaying updates leaves known weaknesses open on your device.',
      },
      {
        heading: 'Lock and encrypt',
        body: 'A screen lock and full-disk encryption (BitLocker, FileVault, or built-in phone encryption) keep your data safe if the device is lost or stolen.',
      },
      {
        heading: 'Install apps carefully',
        body: 'Only install software from official stores or vendor websites, and review the permissions an app requests before granting them.',
      },
    ],
    tips: [
      'Enable automatic updates for the operating system and apps.',
      'Use a PIN, password or biometric lock on every device.',
      'Turn on device encryption and "Find my device".',
      'Back up important files regularly to a separate location.',
    ],
  },
  {
    id: 'social-engineering',
    icon: '🎭',
    title: 'Social Engineering',
    level: 'Intermediate',
    duration: '10 min',
    summary: 'Understand how attackers manipulate trust, urgency and authority to bypass security.',
    lessons: [
      {
        heading: 'Hacking people, not systems',
        body: 'Social engineering exploits human nature (helpfulness, fear, curiosity and respect for authority) to get people to reveal information or grant access.',
      },
      {
        heading: 'Common techniques',
        body: 'Pretexting (a made-up story to gain trust), baiting (infected USB drives or "free" downloads), tailgating (following someone into a secure area) and impersonating managers or IT staff.',
      },
      {
        heading: 'Slow down and verify',
        body: 'Attackers rely on pressure. Taking a moment to verify a request through a separate, trusted channel defeats most social engineering attempts.',
      },
    ],
    tips: [
      'Be suspicious of unexpected requests that create urgency.',
      'Verify identities by calling back on a known number.',
      'Never plug in unknown USB drives.',
      'Limit the personal information you share publicly online.',
    ],
  },
  {
    id: 'network-security',
    icon: '📶',
    title: 'Network Security',
    level: 'Intermediate',
    duration: '12 min',
    summary: 'Stay safe on home and public Wi-Fi and protect the data travelling over your connection.',
    lessons: [
      {
        heading: 'Risks of public Wi-Fi',
        body: 'Open networks in cafés and airports can be monitored, and attackers can set up fake hotspots with convincing names to intercept your traffic.',
      },
      {
        heading: 'Securing your home network',
        body: 'Change the router\'s default admin password, use WPA2 or WPA3 encryption, keep the router firmware updated and disable features you don\'t use, such as WPS.',
      },
      {
        heading: 'HTTPS and VPNs',
        body: 'HTTPS encrypts traffic between you and a website. A trusted VPN adds an encrypted tunnel for all traffic, which is useful on untrusted networks.',
      },
    ],
    tips: [
      'Avoid logging in to sensitive accounts on open public Wi-Fi.',
      'Check that websites use HTTPS before entering information.',
      'Change default router passwords and update firmware.',
      'Use a reputable VPN on untrusted networks.',
    ],
  },
  {
    id: 'ai-deepfake-threats',
    icon: '🤖',
    title: 'AI & Deepfake Threats',
    level: 'Advanced',
    duration: '15 min',
    summary: 'Learn how AI-generated voices, videos and messages are used in scams, and how to spot them.',
    lessons: [
      {
        heading: 'What are deepfakes?',
        body: 'Deepfakes are AI-generated or AI-altered audio, images or video that convincingly imitate a real person. They are increasingly used in fraud and misinformation.',
      },
      {
        heading: 'AI-powered scams',
        body: 'Attackers clone voices from short clips to impersonate family members or executives, and use AI to write flawless, personalized phishing messages at scale.',
      },
      {
        heading: 'Spotting synthetic media',
        body: 'Look for unnatural blinking, lip-sync errors, odd lighting or flat-sounding audio. Detection is getting harder, so verifying the request matters more than inspecting the media.',
      },
    ],
    tips: [
      'Agree on a family or team "safe word" for urgent requests.',
      'Verify unusual money or data requests through a second channel.',
      'Be cautious about how much voice and video of yourself you post publicly.',
      'Treat shocking or emotional viral content with skepticism until confirmed.',
    ],
  },
]

export const getModuleById = (id) => modules.find((module) => module.id === id)

export default modules
