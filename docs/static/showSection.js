function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });

    // Update the active button
    const buttons = document.querySelectorAll('.nav button');
    buttons.forEach(button => {
        button.classList.toggle('active', button.id === sectionId + 'Btn');
    });

    // Toggle visibility of the legend based on the active section
    const legend = document.querySelector('#worldMap .legend');
    if (legend) {
        if (sectionId === 'worldMap') {
            legend.style.display = 'block';
        } else {
            legend.style.display = 'none';
        }
    } else {
        console.error('Legend element not found.');
    }
}
