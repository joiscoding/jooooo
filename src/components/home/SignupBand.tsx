import { useState, type FormEvent } from 'react';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupBand() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setStatus('error');
      return;
    }
    setStatus('ok');
    setEmail('');
  }

  return (
    <section className="hp-signup" aria-labelledby="signup-h">
      <div className="hp-container hp-signup-inner">
        <div>
          <h2 id="signup-h" className="hp-signup-title">
            Get new looks and offers first
          </h2>
          <p className="hp-signup-copy">
            Seasonal edits, restock alerts and member-only pricing. Unsubscribe
            any time.
          </p>
        </div>
        <form className="hp-signup-form" onSubmit={handleSubmit} noValidate>
          <label className="hp-visually-hidden" htmlFor="signup-email">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            className="hp-signup-input"
            placeholder="your@email.com"
            value={email}
            aria-invalid={status === 'error'}
            aria-describedby="signup-msg"
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus('idle');
            }}
          />
          <button type="submit" className="hp-btn hp-btn-light">
            Sign up
          </button>
          <p
            id="signup-msg"
            className={`hp-signup-msg ${status}`}
            role={status === 'error' ? 'alert' : 'status'}
          >
            {status === 'error' &&
              'Enter a valid email address, for example name@example.com.'}
            {status === 'ok' && 'Thanks — you are on the list. (Demo only.)'}
          </p>
        </form>
      </div>
    </section>
  );
}
