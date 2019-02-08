let ideasArray = [];
const ideaContainer = document.getElementById('idea-container');

const getCardsFromStorage = () => {
  if (localStorage.hasOwnProperty('ideas')) {
    const ideas = JSON.parse(localStorage.getItem('ideas'));
    ideas.forEach(idea => {
      const loadedIdea = new Idea(idea.title, idea.body, idea.id, idea.quality);
      ideasArray.push(loadedIdea);
      createCardOnDom(loadedIdea);
    });
  }
}

const addIdea = (title, body) => {
  const idea = new Idea(title, body);
  ideasArray = [...ideasArray, idea];
  idea.saveToStorage(ideasArray);
  createCardOnDom(idea);
}

const deleteIdea = (id) => {
  const newIdeas = ideasArray.filter(idea => idea.id !== parseInt(id));
  ideasArray = newIdeas;
  ideasArray.length > 0 ? ideasArray[0].saveToStorage(newIdeas) : localStorage.removeItem('ideas');
  document.getElementById(id).remove();
}

const removeCardsFromDom = () => {
  Array.from(document.querySelectorAll('.card')).forEach(card => card.remove());
}

const createCardOnDom = (idea) => {
  const qualityText = qualityTextOnDom(idea.quality);
  const html = `
    <div class="card" id=${idea.id}>
      <button class="delete-card"></button>
      <h3 class="search-text title">${idea.title}</h3>
      <p class="search-text body">${idea.body}</p>
      <div class="card-footer">
        <button class="vote up"></button>
        <button class="vote down"></button>
        <p class="quality-text">Quality: <span>${qualityText}</span></p>
      </div>
    </div>
  `;
  ideaContainer.insertAdjacentHTML('afterbegin', html);
}

const updateQuality = (id, direction) => {
  const idea = ideasArray.find(idea => idea.id === parseInt(id));
  const newQuality = idea.changeQuality(direction);
  const textToShow = qualityTextOnDom(newQuality);
  idea.saveToStorage(ideasArray);
  document.getElementById(id).lastElementChild.lastElementChild.firstElementChild.innerText = textToShow;
}

qualityTextOnDom = (quality) => {
  if (quality === 'Swill') {
    return 'Don\'t go wasting your emotion'
  } else if (quality === 'Plausible') {
    return 'Take a chance on me'
  } else {
    return 'Lay all your love on me'
  }
}

const searchCards = (searchText) => {
  const text = searchText.toLowerCase();
  removeCardsFromDom();
  const ideasToShow = ideasArray.filter(idea => idea.title.toLowerCase().includes(text) || idea.body.toLowerCase().includes(text));
  ideasToShow.length > 0 && ideasToShow.forEach(idea => createCardOnDom(idea));
}

const updateIdea = (event) => {
  const idea = ideasArray.find(idea => idea.id === parseInt(event.target.parentElement.id));
  const name = event.target.classList.contains('title') ? 'title' : 'body';
  idea.updateIdea(name, event.target.innerText);
  event.target.removeEventListener('blur', updateIdea);
  idea.saveToStorage(ideasArray);
}

const editText = (target) => {
  target.contentEditable = true;
  target.addEventListener('blur', updateIdea);
}

const filterByQuality = (event) => {
  removeCardsFromDom();
  const ideasToShow = event.target.value === 'All' ? ideasArray : ideasArray.filter(idea => idea.quality === event.target.value);
  ideasToShow.length > 0 && ideasToShow.forEach(idea => createCardOnDom(idea));
}

window.addEventListener('load', getCardsFromStorage);
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();
  const title = document.getElementById('title-input').value;
  const body = document.getElementById('body-input').value;
  this.reset();
  addIdea(title, body);
});
document.getElementById('search-input').addEventListener('input', function(event) {
  searchCards(event.target.value)
});
ideaContainer.addEventListener('click', function(event) {
  const target = event.target.classList;
  target.contains('delete-card') && deleteIdea(event.target.parentElement.id);
  target.contains('up') && updateQuality(event.target.parentElement.parentElement.id, 'up');
  target.contains('down') && updateQuality(event.target.parentElement.parentElement.id, 'down');
});
ideaContainer.addEventListener('dblclick', function(event) {
  const target = event.target.classList;
  target.contains('search-text') && editText(event.target);
});
document.getElementById('quality-filter').addEventListener('change', filterByQuality)

