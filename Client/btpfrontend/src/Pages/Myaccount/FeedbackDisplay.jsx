import React from 'react';

const FeedbackDisplay = ({ data }) => {

  const formatText = (text) => {
    // Regex to detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the text by double newlines (\n\n) for paragraphs
    const paragraphs = text.split('\n\n');

    return paragraphs.map((paragraph, index) => {
      // Split each paragraph by single newline (\n) for individual lines
      const lines = paragraph.split('\n').map((line, lineIndex) => {
        // Replace URLs with clickable links
        const formattedLine = line.split(urlRegex).map((part, partIndex) => {
          if (urlRegex.test(part)) {
            // If part matches URL, render as link
            return (
              <a key={partIndex} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                {part}
              </a>
            );
          }
          // Otherwise, render as regular text
          return part;
        });

        if (lineIndex === 0) {
          // Highlight the first line
          return (
            <span key={lineIndex} style={{ fontWeight: 'bold' }}>
              {formattedLine}
              <br />
            </span>
          );
        } else {
          // Regular lines
          return (
            <span key={lineIndex}>
              {formattedLine}
              <br />
            </span>
          );
        }
      });

      return (
        <div key={index} style={{ marginBottom: '16px' }}>
          {lines}
        </div>
      );
    });
  };

  return (
    <div>
      <div>{formatText(data)}</div>
    </div>
  );
};

export default FeedbackDisplay;
