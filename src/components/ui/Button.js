import Link from 'next/link';

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-ink text-white hover:bg-ink-light',
  outline: 'border-2 border-white text-white hover:bg-white hover:text-ink',
  ghost: 'border-2 border-ink text-ink hover:bg-ink hover:text-white',
};

// Renders a Link when `href` is given, otherwise a <button>
export default function Button({ href, variant = 'primary', className = '', children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors ${VARIANTS[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
