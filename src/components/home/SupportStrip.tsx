import { ChatIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../Icons';

const ITEMS = [
  {
    id: 'shipping',
    icon: <TruckIcon />,
    title: 'Free shipping',
    copy: 'On every order, no minimum spend.',
  },
  {
    id: 'returns',
    icon: <ReturnIcon />,
    title: 'Free 30-day returns',
    copy: 'Try the full look at home first.',
  },
  {
    id: 'advisor',
    icon: <ChatIcon />,
    title: 'Style advisors',
    copy: 'Chat with a stylist, 9am–9pm ET.',
  },
  {
    id: 'guarantee',
    icon: <ShieldIcon />,
    title: 'Made to last',
    copy: 'Two-year guarantee on every piece.',
  },
];

export function SupportStrip() {
  return (
    <section className="hp-support" id="support" aria-labelledby="support-h">
      <div className="hp-container">
        <h2 id="support-h" className="hp-visually-hidden">
          Service and support
        </h2>
        <ul className="hp-support-grid">
          {ITEMS.map((item) => (
            <li key={item.id} className="hp-support-item">
              <span className="hp-support-icon">{item.icon}</span>
              <div>
                <h3 className="hp-support-title">{item.title}</h3>
                <p className="hp-support-copy">{item.copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
