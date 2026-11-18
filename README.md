Dependency arrays

The dependency array is the list at the end of useEffect. It tells React when to run the Effect again.

Array	When the Effect runs	Used in this lab
[text]	After the first render, then again only when text changes	Title Mirror
[note]	After the first render, then again only when note changes	Saved Note
[]	Once after the component appears, and cleanup when it disappears	Live Clock
No array	After every render	Not used
Refresh the page

When the page refreshes, all React state is lost and the page starts again from the beginning. The Title Mirror box is empty again because text is only state. The Saved Note comes back because it was saved in localStorage, which is outside React and survives a refresh. The note is restored in useState(() => localStorage.getItem('note')), so the first render already has the saved text.

Hide and show the clock

When the clock is hidden, the LiveClock component is removed from the page. React runs the cleanup function, clearInterval(id), which stops the timer. When it is shown again, the component is created again, the Effect runs, and a new timer starts. Without the cleanup, hiding the clock would leave the old timer running, and every Show would add another timer on top, so the clock would tick faster and faster.
