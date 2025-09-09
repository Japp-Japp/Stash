const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

//write to target with delay
function writeText(target, content, delay = 2) {
    return new Promise((resolve) => {
        if (!content) {
            resolve();
            return;
        }

        const contentArray = content.split('');
        target.textContent = '';
        let current = 0;

        while (current < contentArray.length) {
            ((curr) => {
                setTimeout(() => {
                    target.textContent += contentArray[curr];
                    if (curr === contentArray.length - 1) resolve();
                }, delay * curr);
            })(current++);
        }
    });
}

//write to table with delay
async function writeTable(targets, contents, delay = 2) {
    for (let i = 0; i < targets.length; i++) {
        await writeText(targets[i], contents[i]);
        await wait(delay);
    }
}


//execute on page load
document.addEventListener('pageLoaded', async () => {
	//logo
	const logo = document.getElementById('logo');
	const logoContent = logo.innerText;
	logo.innerHTML = '';
	
	//timetable
	let cells = [];
	let contents = [];
	const timetable = document.getElementById('timetable');
	if (timetable) {
		cells = timetable.querySelectorAll('thead th, tbody td');
		contents = Array.from(cells).map(cell => cell.textContent);
		cells.forEach(cell => cell.textContent = '');
	}
	
	//footer
	const footer = document.getElementById('footer');
	const footerContent = footer.innerText;
	footer.innerHTML = '';
	
	//cursor
	const cursor = document.getElementById('cursor')
	
	await wait(1000);
	await writeText(logo, logoContent);
	await wait(500);
	await writeTable(cells, contents, 30, 100);
	await wait(500);
	await writeText(footer, footerContent);
	await wait(500);
	cursor.prepend('> ')
	underscore.innerHTML = '_'
})