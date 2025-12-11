export function createProject(data) {
return {
id: Date.now(),
...data
};
}

export function listProjects() {
return [];
}