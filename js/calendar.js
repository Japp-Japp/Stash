const url = 'https://schedule.wheedbear.workers.dev';

fetch(url)
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch ICS');
        return res.text();
    })
    .then(data => {
        const jcal = ICAL.parse(data);
        const comp = new ICAL.Component(jcal);
        const events = comp.getAllSubcomponents('vevent').map(ev => new ICAL.Event(ev));

		//sort ascending
        events.sort((a, b) => a.startDate.toJSDate() - b.startDate.toJSDate());


		const today = new Date();
		let tableRows = '';
		if (events.length > 0) {
			//subtract one day for buffer
			today.setDate(today.getDate() - 1);
			let startDate = today;
			const lastDate = events[events.length - 1].startDate.toJSDate();

			const eventDays = new Map();
			events.forEach(e => {
				const key = e.startDate.toJSDate().toDateString();
				eventDays.set(key, e);
			});

			//iterate all dates from first to last event
			while (currentDate <= lastDate) {
				const isoDate = startDate.toDateString();
				const isToday = startDate.toDateString() === today.toDateString();
				const dayOfWeek = startDate.toLocaleDateString(undefined, { weekday: 'long' });
				const fullDate = startDate.toLocaleDateString();

				let status = 'Free';
				let startStr = '';
				let endStr = '';

				//build work event string
				if(eventDays.has(isoDate)){
					const e = eventDays.get(isoDate);
					const start = e.startDate.toJSDate();
					const end = e.endDate.toJSDate();
					startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
					endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
					status = 'Working';
				}
				
				if(dayOfWeek === 'Monday'){
					tableRows += `<tr class="break"><td colspan="5"></td></tr>`;
				}
				
				tableRows += `<tr class="${isToday ? 'day' : ''}">
					<td>${fullDate}</td>
					<td>${dayOfWeek}</td>
					<td>${status}</td>
					<td>${startStr}</td>
					<td>${endStr}</td>
					</tr>`;

				startDate.setDate(startDate.getDate() + 1);
			}
		}

        document.querySelector('#timetable tbody').innerHTML = tableRows || '<tr><td colspan="5">No events</td></tr>';
		
		//done loading
		document.dispatchEvent(new Event('pageLoaded'));
    })
    .catch(err => {
        document.querySelector('#timetable tbody').innerHTML = `<tr><td colspan="5">Error loading events</td></tr>`;
		console.error(err);
    });