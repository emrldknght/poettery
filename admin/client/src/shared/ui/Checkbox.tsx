interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          width: '14px',
          height: '14px',
          accentColor: 'var(--accent)',
          cursor: 'pointer',
        }}
      />
      {label && <span style={{ fontSize: '13px' }}>{label}</span>}
    </label>
  );
}