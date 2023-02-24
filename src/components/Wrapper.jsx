export default function Wrapper({ children, className, ...rest }) {
  return (
    <div className={`container col-md-9 ${className}`} {...rest}>
      {children}
    </div>
  );
}
