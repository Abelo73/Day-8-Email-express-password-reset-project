import { useRef } from "react";

const OtpInput = ({ length = 6, onChange }) => {
  const inputs = useRef([]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;

    // Allow only one digit
    if (/^[0-9]$/.test(value)) {
      inputs.current[index].value = value;
      if (index < length - 1) {
        inputs.current[index + 1].focus(); // Focus next input
      }
      onChange(inputs.current.map((input) => input.value).join(""));
    } else if (value === "") {
      onChange(inputs.current.map((input) => input.value).join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !inputs.current[index].value && index > 0) {
      inputs.current[index - 1].focus(); // Focus previous input
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (/^\d+$/.test(paste) && paste.length === length) {
      paste.split("").forEach((digit, idx) => {
        inputs.current[idx].value = digit;
      });
      onChange(paste);
    }
    e.preventDefault();
  };

  return (
    <div onPaste={handlePaste} className="flex space-x-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          ref={(el) => (inputs.current[index] = el)}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-10 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ))}
    </div>
  );
};

export default OtpInput;
