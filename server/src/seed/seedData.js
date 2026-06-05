/**
 * Seed definitions: 4 canonical forms and their responses.
 *
 * Responses are written as { "<Field Label>": value } and mapped to stable
 * field ids by the seeder. Distributions are *designed*, not random, so the
 * analytics dashboard tells a clear story (a leading skill, a skewed rating,
 * a dominant ticket type, etc.).
 */

const jobApplication = {
  form: {
    title: 'Job Application',
    description: 'Apply for an engineering role at our company.',
    fields: [
      { label: 'Name', type: 'text', required: true },
      { label: 'Email', type: 'text', required: true, format: 'email' },
      { label: 'Experience', type: 'number', required: true, min: 0, max: 50 },
      { label: 'Skills', type: 'multiselect', required: true, options: ['React', 'Node', 'MongoDB', 'TypeScript', 'Python'] },
      { label: 'Preferred Role', type: 'select', required: true, options: ['Frontend', 'Backend', 'Fullstack', 'DevOps'] },
    ],
  },
  responses: [
    { Name: 'Ada Lovelace', Email: 'ada@example.com', Experience: 8, Skills: ['React', 'Node', 'TypeScript'], 'Preferred Role': 'Fullstack' },
    { Name: 'Alan Turing', Email: 'alan@example.com', Experience: 12, Skills: ['Node', 'MongoDB', 'Python'], 'Preferred Role': 'Backend' },
    { Name: 'Grace Hopper', Email: 'grace@example.com', Experience: 15, Skills: ['React', 'TypeScript'], 'Preferred Role': 'Frontend' },
    { Name: 'Linus Torvalds', Email: 'linus@example.com', Experience: 20, Skills: ['Node', 'Python'], 'Preferred Role': 'DevOps' },
    { Name: 'Margaret Hamilton', Email: 'margaret@example.com', Experience: 6, Skills: ['React', 'Node', 'MongoDB'], 'Preferred Role': 'Fullstack' },
    { Name: 'Dennis Ritchie', Email: 'dennis@example.com', Experience: 3, Skills: ['React'], 'Preferred Role': 'Frontend' },
    { Name: 'Barbara Liskov', Email: 'barbara@example.com', Experience: 10, Skills: ['React', 'Node', 'TypeScript', 'MongoDB'], 'Preferred Role': 'Fullstack' },
    { Name: 'Ken Thompson', Email: 'ken@example.com', Experience: 1, Skills: ['Python'], 'Preferred Role': 'Backend' },
    { Name: 'Donald Knuth', Email: 'don@example.com', Experience: 25, Skills: ['React', 'Node'], 'Preferred Role': 'Fullstack' },
    { Name: 'Edsger Dijkstra', Email: 'edsger@example.com', Experience: 5, Skills: ['Node', 'TypeScript'], 'Preferred Role': 'Backend' },
  ],
};

const eventRegistration = {
  form: {
    title: 'Event Registration',
    description: 'Register for our annual developer conference.',
    fields: [
      { label: 'Full Name', type: 'text', required: true },
      { label: 'Contact Number', type: 'text', required: true },
      { label: 'Ticket Type', type: 'select', required: true, options: ['Standard', 'VIP', 'Student'] },
      { label: 'Number of Tickets', type: 'number', required: true, min: 1, max: 10 },
      { label: 'Attending Days', type: 'multiselect', required: true, options: ['Day 1', 'Day 2', 'Day 3'] },
    ],
  },
  responses: [
    { 'Full Name': 'Jane Doe', 'Contact Number': '555-0101', 'Ticket Type': 'Standard', 'Number of Tickets': 2, 'Attending Days': ['Day 1', 'Day 2'] },
    { 'Full Name': 'John Smith', 'Contact Number': '555-0102', 'Ticket Type': 'VIP', 'Number of Tickets': 1, 'Attending Days': ['Day 1', 'Day 2', 'Day 3'] },
    { 'Full Name': 'Priya Patel', 'Contact Number': '555-0103', 'Ticket Type': 'Standard', 'Number of Tickets': 4, 'Attending Days': ['Day 2'] },
    { 'Full Name': 'Carlos Ruiz', 'Contact Number': '555-0104', 'Ticket Type': 'Student', 'Number of Tickets': 1, 'Attending Days': ['Day 1'] },
    { 'Full Name': 'Mei Lin', 'Contact Number': '555-0105', 'Ticket Type': 'Standard', 'Number of Tickets': 3, 'Attending Days': ['Day 1', 'Day 3'] },
    { 'Full Name': 'Tom Becker', 'Contact Number': '555-0106', 'Ticket Type': 'VIP', 'Number of Tickets': 2, 'Attending Days': ['Day 2', 'Day 3'] },
    { 'Full Name': 'Sara Nilsson', 'Contact Number': '555-0107', 'Ticket Type': 'Standard', 'Number of Tickets': 1, 'Attending Days': ['Day 1', 'Day 2'] },
    { 'Full Name': 'Omar Farouk', 'Contact Number': '555-0108', 'Ticket Type': 'Student', 'Number of Tickets': 2, 'Attending Days': ['Day 3'] },
    { 'Full Name': 'Nina Kowalski', 'Contact Number': '555-0109', 'Ticket Type': 'Standard', 'Number of Tickets': 6, 'Attending Days': ['Day 1', 'Day 2', 'Day 3'] },
  ],
};

const customerFeedback = {
  form: {
    title: 'Customer Feedback',
    description: 'Tell us about your recent experience.',
    fields: [
      { label: 'Customer Name', type: 'text', required: true },
      { label: 'Rating', type: 'number', required: true, min: 1, max: 5 },
      { label: 'Service Used', type: 'select', required: true, options: ['Support', 'Sales', 'Billing', 'Onboarding'] },
      { label: 'Feedback', type: 'text', required: false },
      { label: 'Would Recommend', type: 'select', required: true, options: ['Yes', 'No'] },
    ],
  },
  // Ratings designed to average ~3.8; Recommend skewed ~70% Yes.
  responses: [
    { 'Customer Name': 'Riley Cooper', Rating: 5, 'Service Used': 'Support', Feedback: 'Fast and helpful!', 'Would Recommend': 'Yes' },
    { 'Customer Name': 'Sam Devlin', Rating: 4, 'Service Used': 'Onboarding', Feedback: 'Smooth setup.', 'Would Recommend': 'Yes' },
    { 'Customer Name': 'Jordan Lee', Rating: 2, 'Service Used': 'Billing', Feedback: 'Confusing invoice.', 'Would Recommend': 'No' },
    { 'Customer Name': 'Casey Morgan', Rating: 5, 'Service Used': 'Support', 'Would Recommend': 'Yes' },
    { 'Customer Name': 'Taylor Brooks', Rating: 3, 'Service Used': 'Sales', Feedback: 'Average experience.', 'Would Recommend': 'Yes' },
    { 'Customer Name': 'Avery Quinn', Rating: 4, 'Service Used': 'Support', 'Would Recommend': 'Yes' },
    { 'Customer Name': 'Drew Parker', Rating: 1, 'Service Used': 'Billing', Feedback: 'Charged twice.', 'Would Recommend': 'No' },
    { 'Customer Name': 'Jamie Fox', Rating: 5, 'Service Used': 'Onboarding', Feedback: 'Loved the demo.', 'Would Recommend': 'Yes' },
    { 'Customer Name': 'Robin Shah', Rating: 4, 'Service Used': 'Sales', 'Would Recommend': 'Yes' },
    { 'Customer Name': 'Skyler Reed', Rating: 5, 'Service Used': 'Support', Feedback: 'Best team!', 'Would Recommend': 'Yes' },
  ],
};

const developerSurvey = {
  form: {
    title: 'Developer Community Survey',
    description: 'Help us understand the developer community.',
    fields: [
      { label: 'Full Name', type: 'text', required: true },
      { label: 'Work Email', type: 'text', required: true, format: 'email' },
      { label: 'Years of Experience', type: 'number', required: true, min: 0, max: 50 },
      { label: 'Primary Languages', type: 'multiselect', required: true, options: ['JavaScript', 'Python', 'Go', 'Rust', 'Java'] },
      { label: 'Employment Type', type: 'select', required: true, options: ['Full-time', 'Part-time', 'Freelance', 'Student'] },
      { label: 'Satisfaction', type: 'number', required: true, min: 1, max: 10 },
    ],
  },
  responses: [
    { 'Full Name': 'Wei Zhang', 'Work Email': 'wei@dev.io', 'Years of Experience': 5, 'Primary Languages': ['JavaScript', 'Python'], 'Employment Type': 'Full-time', Satisfaction: 8 },
    { 'Full Name': 'Lucia Rossi', 'Work Email': 'lucia@dev.io', 'Years of Experience': 9, 'Primary Languages': ['JavaScript', 'Go'], 'Employment Type': 'Full-time', Satisfaction: 7 },
    { 'Full Name': 'Ahmed Khan', 'Work Email': 'ahmed@dev.io', 'Years of Experience': 2, 'Primary Languages': ['Python', 'Java'], 'Employment Type': 'Student', Satisfaction: 6 },
    { 'Full Name': 'Sofia Garcia', 'Work Email': 'sofia@dev.io', 'Years of Experience': 12, 'Primary Languages': ['JavaScript', 'Rust', 'Go'], 'Employment Type': 'Freelance', Satisfaction: 9 },
    { 'Full Name': 'Noah Williams', 'Work Email': 'noah@dev.io', 'Years of Experience': 7, 'Primary Languages': ['JavaScript', 'Java'], 'Employment Type': 'Full-time', Satisfaction: 8 },
    { 'Full Name': 'Hana Kim', 'Work Email': 'hana@dev.io', 'Years of Experience': 1, 'Primary Languages': ['Python'], 'Employment Type': 'Student', Satisfaction: 5 },
    { 'Full Name': 'Pieter Bakker', 'Work Email': 'pieter@dev.io', 'Years of Experience': 15, 'Primary Languages': ['JavaScript', 'Go', 'Rust'], 'Employment Type': 'Full-time', Satisfaction: 10 },
    { 'Full Name': 'Fatima Noor', 'Work Email': 'fatima@dev.io', 'Years of Experience': 4, 'Primary Languages': ['Python', 'JavaScript'], 'Employment Type': 'Part-time', Satisfaction: 7 },
    { 'Full Name': 'Diego Mendez', 'Work Email': 'diego@dev.io', 'Years of Experience': 6, 'Primary Languages': ['Java', 'Go'], 'Employment Type': 'Freelance', Satisfaction: 6 },
    { 'Full Name': 'Yuki Tanaka', 'Work Email': 'yuki@dev.io', 'Years of Experience': 3, 'Primary Languages': ['JavaScript', 'Python', 'Rust'], 'Employment Type': 'Full-time', Satisfaction: 9 },
  ],
};

module.exports = [jobApplication, eventRegistration, customerFeedback, developerSurvey];
