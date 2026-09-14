// type: 'loading' | 'error' | 'empty' | 'success'
export default function StatusMessage({ type, children }) {
  const className = 'status-message status-' + type;
  return <div className={className}>{children}</div>;
}
