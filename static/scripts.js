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
            const name = document.getElementById("task-name").value;
            const description = document.getElementById("task-description").value;
            const priority = document.getElementById("task-priority").value;
            const taskListId = document.getElementById("task-list-id").value;

            // Validate inputs (for example, priority must be between 1 and 5)
            if (!name || !taskListId || !priority) {
                console.error("All form fields are required");
                return;
            }

            // Send POST request to create a new task
            try {
                const response = await fetch(`/tasks/?name=${name}&task_list_id=${taskListId}&description=${description}&priority=${priority}`, {
                    method: "POST",
                });

                if (response.ok) {
                    console.log("Task created successfully");
                    fetchTaskLists();  // Reload task lists after creating a new task
                } else {
                    console.error("Failed to create task");
                }
            } catch (error) {
                console.error("Error creating task:", error);
            }
        });
    }
});

// Function to fetch and display task lists
async function fetchTaskLists() {
    const taskListsContainer = document.getElementById("task-lists");
    if (!taskListsContainer) {
        console.error("Task lists container not found");
        return;
    }

    try {
        const response = await fetch("/task-lists/");
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
