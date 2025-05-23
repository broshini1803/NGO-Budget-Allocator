let projectCount = 0;

function addProject() {
  const container = document.getElementById('project-inputs');
  const card = document.createElement('div');
  card.classList.add('project-card');
  card.setAttribute('id', `project-${projectCount}`);

  card.innerHTML = `
    <button class="delete-btn" onclick="deleteProject('project-${projectCount}')">Delete</button>
    <label>Project Name:</label>
    <input type="text" class="project-name" placeholder="e.g., Tree Plantation" />

    <label>Cost (₹):</label>
    <input type="number" class="project-cost" min="0" />

    <label>Impact Score:</label>
    <input type="number" class="project-impact" min="0" />
  `;

  container.appendChild(card);
  projectCount++;
}

function deleteProject(id) {
  const card = document.getElementById(id);
  if (card) card.remove();
}

function collectData() {
  const budget = parseInt(document.getElementById('budget').value);
  if (isNaN(budget) || budget <= 0) {
    alert("Please enter a valid total budget.");
    return null;
  }

  const names = document.querySelectorAll('.project-name');
  const costs = document.querySelectorAll('.project-cost');
  const impacts = document.querySelectorAll('.project-impact');

  const projects = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i].value.trim();
    const cost = parseInt(costs[i].value);
    const impact = parseInt(impacts[i].value);

    if (name && !isNaN(cost) && cost >= 0 && !isNaN(impact) && impact >= 0) {
      projects.push({
        name,
        cost,
        impact
      });
    }
  }

  if (projects.length === 0) {
    alert("Please add at least one valid project.");
    return null;
  }

  return { budget, projects };
}

function runMergeSort() {
  const data = collectData();
  if (!data) return;

  fetch("http://localhost:5000/merge-sort", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects: data.projects }),
  })
    .then(res => res.json())
    .then(sorted => {
      displayProjects(sorted, 'Sorted Projects (by Impact Score)');
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Error running merge sort. Make sure the backend is running.");
    });
}

function runKnapsack() {
  const data = collectData();
  if (!data) return;

  fetch('http://localhost:5000/knapsack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      displayProjects(result.selected_projects, 'Selected Projects for Maximum Impact');
      const output = document.getElementById('output');
      output.innerHTML += `
        <p><strong>Total Cost:</strong> ₹${result.total_cost}</p>
        <p><strong>Total Impact:</strong> ${result.total_impact}</p>
      `;
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Error running knapsack. Make sure the backend is running.");
    });
}

function displayProjects(projects, title) {
  const output = document.getElementById('output');
  output.innerHTML = `<h3>${title}</h3>`;
  let html = `<table><tr><th>Name</th><th>Cost (₹)</th><th>Impact</th></tr>`;
  projects.forEach(p => {
    html += `<tr><td>${p.name}</td><td>${p.cost}</td><td>${p.impact}</td></tr>`;
  });
  html += `</table>`;
  output.innerHTML += html;
}

// Add one project input initially on load
window.onload = () => addProject();
