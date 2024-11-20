document.addEventListener("DOMContentLoaded", () => {
    // Fetch task lists when the page loads
    fetchTaskLists();

    // Get the form element
    const form = document.getElementById("create-task-form");

    // Add event listener for form submission
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();  // Prevent the form from reloading the page

            // Get form values
            const name = document.getElementById("task-name").value.trim();
            const description = document.getElementById("task-description").value.trim();
            const priority = document.getElementById("task-priority").value.trim();
            const taskListId = document.getElementById("task-list-id").value.trim();

            // Validate inputs
            if (!name || !taskListId || !priority) {
                alert("Please fill out all required fields.");
                return;
            }

            // Ensure priority is a number between 1 and 5
            const priorityValue = parseInt(priority, 10);
            if (isNaN(priorityValue) || priorityValue < 1 || priorityValue > 5) {
                alert("Priority must be a number between 1 and 5.");
                return;
            }

            // Send POST request to create a new task
            try {
                const response = await fetch("http://127.0.0.1:8000/tasks/", {  // Use the full URL
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        priority: priorityValue,
                        task_list_id: parseInt(taskListId, 10)
                    })
                });

                if (response.ok) {
                    alert("Task created successfully!");
                    fetchTaskLists();  // Reload task lists after creating a new task
                    form.reset();  // Clear the form
                } else {
                    alert("Failed to create task. Please try again.");
                }
            } catch (error) {
                alert("An error occurred while creating the task. Please try again.");
                console.error("Error:", error);
            }
        });
    }
});

// Function to fetch and display task lists
async function fetchTaskLists() {
    const taskListsContainer = document.getElementById("task-lists");
    if (!taskListsContainer) {
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/task-lists/");  // Check if this URL is correct
        if (!response.ok) {
            console.error("Failed to fetch task lists. Status:", response.status);
            return;
        }

        const taskLists = await response.json();
        taskListsContainer.innerHTML = "";  // Clear the container
        taskLists.forEach((list) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${list.name}</strong>: ${list.description}`;
            taskListsContainer.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching task lists:", error);
    }
}
