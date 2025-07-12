return items.map(item => {
  const timeline = item.json.timeline || [];

  const allEmails = new Set();
  const clickedSet = new Set();
  const submittedSet = new Set();

  for (const event of timeline) {
    const email = event.email;
    if (!email) continue;

    allEmails.add(email);

    if (event.message === 'Clicked Link') {
      clickedSet.add(email);
    }

    if (event.message === 'Submitted Data') {
      submittedSet.add(email);
    }
  }

  return {
    json: {
      campaignName: item.json.name,
      totalTargets: allEmails.size,
      emailSent: allEmails.size, // all who got emails
      clicked: clickedSet.size,
      submitted: submittedSet.size,
      clickRate: ((clickedSet.size / allEmails.size) * 100).toFixed(1) + '%',
      submissionRate: ((submittedSet.size / allEmails.size) * 100).toFixed(1) + '%',
      users: Array.from(allEmails).map(email => ({
        email,
        clicked: clickedSet.has(email),
        submitted: submittedSet.has(email),
      }))
    }
  };
});
