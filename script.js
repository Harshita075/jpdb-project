const proxyURL = "https://cors-anywhere.herokuapp.com/";
const jpdbBaseURL = "http://api.login2explore.com:5577";
const token = "90935036|-31949209496791376|90958904";
const dbName = "COLLEGE-DB";
const relName = "PROJECT-TABLE";
let recordExists = false;

function resetForm() {
  document.getElementById("projectId").value = "";
  document.getElementById("projectName").value = "";
  document.getElementById("assignedTo").value = "";
  document.getElementById("assignmentDate").value = "";
  document.getElementById("deadline").value = "";

  document.getElementById("projectId").disabled = false;
  document.getElementById("saveBtn").disabled = true;
  document.getElementById("updateBtn").disabled = true;
  recordExists = false;
  document.getElementById("projectId").focus();
}

function isValidForm() {
  return ["projectId", "projectName", "assignedTo", "assignmentDate", "deadline"]
    .every(id => document.getElementById(id).value.trim() !== "");
}

function getProject() {
  const pid = document.getElementById("projectId").value.trim();
  if (!pid) return;

  const reqData = {
    token,
    cmd: "GET_BY_KEY",
    dbName,
    rel: relName,
    jsonStr: JSON.stringify({ "Project-ID": pid })
  };

  fetch(proxyURL + jpdbBaseURL + "/api/irl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200 && data.data) {
        recordExists = true;
        fillForm(data.data.record);
        document.getElementById("projectId").disabled = true;
        document.getElementById("saveBtn").disabled = true;
        document.getElementById("updateBtn").disabled = false;
      } else {
        recordExists = false;
        document.getElementById("saveBtn").disabled = false;
        document.getElementById("updateBtn").disabled = true;
      }
    })
    .catch(err => {
      alert("❌ Could not connect to JPDB (via proxy)");
      console.error("GET Error:", err);
    });
}

function fillForm(data) {
  document.getElementById("projectName").value = data["Project-Name"];
  document.getElementById("assignedTo").value = data["Assigned-To"];
  document.getElementById("assignmentDate").value = data["Assignment-Date"];
  document.getElementById("deadline").value = data["Deadline"];
}

function saveData() {
  if (recordExists) return alert("Record already exists. Use Update.");
  if (!isValidForm()) return alert("❗ Please fill all fields.");

  const data = {
    "Project-ID": document.getElementById("projectId").value.trim(),
    "Project-Name": document.getElementById("projectName").value.trim(),
    "Assigned-To": document.getElementById("assignedTo").value.trim(),
    "Assignment-Date": document.getElementById("assignmentDate").value.trim(),
    "Deadline": document.getElementById("deadline").value.trim()
  };

  const req = {
    token,
    cmd: "PUT",
    dbName,
    rel: relName,
    jsonStr: JSON.stringify(data)
  };

  fetch(proxyURL + jpdbBaseURL + "/api/iml", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === 200) {
        alert("✅ Project saved successfully.");
        resetForm();
      } else {
        alert("❌ Failed to save project.");
        console.log("Save Error:", response);
      }
    })
    .catch(err => {
      alert("❌ Network error during save.");
      console.error("Save Error:", err);
    });
}

function updateData() {
  if (!recordExists) return alert("No existing record found.");
  if (!isValidForm()) return alert("❗ Please fill all fields.");

  const data = {
    "Project-ID": document.getElementById("projectId").value.trim(),
    "Project-Name": document.getElementById("projectName").value.trim(),
    "Assigned-To": document.getElementById("assignedTo").value.trim(),
    "Assignment-Date": document.getElementById("assignmentDate").value.trim(),
    "Deadline": document.getElementById("deadline").value.trim()
  };

  const req = {
    token,
    cmd: "UPDATE",
    dbName,
    rel: relName,
    jsonStr: JSON.stringify(data)
  };

  fetch(proxyURL + jpdbBaseURL + "/api/iml", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === 200) {
        alert("✅ Project updated successfully.");
        resetForm();
      } else {
        alert("❌ Failed to update project.");
        console.log("Update Error:", response);
      }
    })
    .catch(err => {
      alert("❌ Network error during update.");
      console.error("Update Error:", err);
    });
}

window.onload = () => {
  resetForm();
  document.getElementById("projectId").addEventListener("blur", getProject);
};
