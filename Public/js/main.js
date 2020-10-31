//if notes are not available then show this text
const noteSection = document.getElementById('card-container').children;
const emptyText = document.getElementById('card-container');
if (noteSection.length === 0) {
    emptyText.innerHTML = `<p>Nothing to show! Use "Add a Note" section above to add notes.</p>`;
}


//Search function
const search = document.getElementById('search');
search.addEventListener('input', () => {
    let inputVal = search.value;
    let noteCard = document.getElementsByClassName('card');

    Array.from(noteCard).forEach((element) => {
        let titleTxt = element.getElementsByTagName('h2')[0].innerText;
        let noteTxt = element.getElementsByTagName('p')[0].innerText;

        if (titleTxt.includes(inputVal) || noteTxt.includes(inputVal)) {
            element.style.display = 'block';
        }else{
            element.style.display = 'none';
        }
    });
});