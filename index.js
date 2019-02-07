// filter by quality

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

const createCardOnDom = (idea) => {
  const html = `
    <div class="card" id=${idea.id}>
      <button class="delete-card">Delete Card</button>
      <h3 class="search-text title">${idea.title}</h3>
      <p class="search-text body">${idea.body}</p>
      <div>
        <button class="vote up">Upvote</button>
        <button class="vote down">Downvote</button>
        <p>Quality: <span>${idea.quality}</span></p>
      </div>
    </div>
  `;
  ideaContainer.insertAdjacentHTML('afterbegin', html);
}

const updateQuality = (id, direction) => {
  const idea = ideasArray.find(idea => idea.id === parseInt(id));
  const newQuality = idea.changeQuality(direction);
  idea.saveToStorage(ideasArray);
  document.getElementById(id).lastElementChild.lastElementChild.firstElementChild.innerText = newQuality;
}

const searchCards = (searchText) => {
  document.querySelectorAll('.card').forEach(item => {
    const title = item.firstElementChild.nextElementSibling.innerText;
    const body = item.firstElementChild.nextElementSibling.nextElementSibling.innerText;
    item.parentElement.style.display = (title.includes(searchText) || body.includes(searchText)) ? 'block' : 'none';
  });
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

