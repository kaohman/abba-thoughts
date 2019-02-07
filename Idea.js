class Idea {
  constructor(title, body, id, quality) {
    this.title = title;
    this.body = body;
    this.id = id || Date.now();
    this.quality = quality || 'Swill';
  }

  saveToStorage(ideasArray) {
    localStorage.setItem('ideas', JSON.stringify(ideasArray));
  }

  updateIdea(name, value) {
    this[name] = value;
  }

  changeQuality(direction) {
    const qualityArray = ['Swill', 'Plausible', 'Genius'];
    const i = qualityArray.indexOf(this.quality);
    if (direction === 'up') {
      this.quality = i < qualityArray.length-1 ? qualityArray[i + 1] : this.quality;
    } else {
      this.quality = i > 0 ? qualityArray[i - 1] : this.quality;
    }
    return this.quality
  }
}