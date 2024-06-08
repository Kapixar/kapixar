const projectTabs = document.querySelectorAll('.project');

// if project div is in full sight on mobile, add class hightlight
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
            entry.target.classList.add('highlight');
        } else {
            entry.target.classList.remove('highlight');
        }
    });
}, {threshold: [0, 1]});

projectTabs.forEach((project) => {
    observer.observe(project);
});