import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ value, onChange, placeholder = 'Password', required = true, name = 'password', id = 'password' }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-12"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary focus:outline-none"
      >
        {showPassword ? (
          <EyeOff size={20} className="transition-colors" />
        ) : (
          <Eye size={20} className="transition-colors" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
