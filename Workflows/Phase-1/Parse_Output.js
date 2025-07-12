return items.map(item => {
  const raw = item.json.output || '';

  // Extract name between the first two --- lines
  const nameMatch = raw.match(/---\s*([\w\s\-]+)\s*---/);
  const templateName = nameMatch ? nameMatch[1].trim() : 'Untitled_Template';

  // Extract Email HTML block
  const emailMatch = raw.match(/Email_HTML:\s*([\s\S]*?)\n\s*Landing_Page_HTML:/i);
  const landingMatch = raw.match(/Landing_Page_HTML:\s*([\s\S]*?)---$/i);

  if (!emailMatch || !landingMatch) {
    throw new Error('Unable to extract email or landing page HTML');
  }

  const emailHTML = emailMatch[1].trim();
  const landingPageHTML = landingMatch[1].trim();

  return {
    json: {
      name: templateName,
      emailHTML,
      landingPageHTML,
    },
  };
});
