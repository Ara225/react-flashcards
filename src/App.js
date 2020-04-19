import React from 'react';
import * as yaml from 'js-yaml';

class FlashCardApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], showBack: false, currentItem: 0, text: null,
      style: {"paddingTop": "15%", "paddingBottom": "15%", "paddingLeft": "15%", "paddingRight": "15%"} };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.flip = this.flip.bind(this);
    this.getNew = this.getNew.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleFileLoad = this.handleFileLoad.bind(this);
  }

  render() {
    return (
      <div class="container col-5">
        <br/>
        <br/>
        <FlashCardList items={this.state.items} showBack={this.state.showBack} currentItem={this.state.currentItem} 
            style={this.state.style} />
        <div class="text-center form-group">
          <br/>
          <button class="btn btn-primary" onClick={this.flip}>
            Flip Flash Card
          </button>
          &nbsp; &nbsp;
          <button class="btn btn-info" onClick={this.getNew}>
            Another Flash Card
          </button>
        </div>
        <br/>
        <h4 class="text-center">Add New Flashcards from Yaml</h4>
        <div class="text-center">
            <input type="file" name="file"  onChange={this.handleFileSelect}/>
            &nbsp; &nbsp;
            <button class="btn" onClick={function () {
              alert('File format:\n ' +
                     'SectionName:\n    Weight: 2\n    Description: blah blah\n    Key Knowledge Areas:\n        - Blah Blah\n    Examples:\n' +
                     '        - / (root) filesystem\n    Questions:\n        Prompts:\n            - / (root) filesystem\n        Answers:\n            ' +
                     '- / (root) filesystem\n\nNotes:\nMultiple top level keys are supported but they\'re all lumped together, only the Questions key and ' + 
                     'it\'s Prompts/Answers keys are needed under each\n')}}>
                Yaml File Format
            </button>
        </div>
        <br/>
        <h4 class="text-center">Add New Flashcards Manually</h4>
        <form onSubmit={this.handleSubmit} class="form-group">
          <input class="form-control" id="new-flashcard-front" placeholder="Front of Flash Card"/>
        <br/>
          <input class="form-control" id="new-flashcard-back"placeholder="Back of Flash Card"/>
        <br/>
          <button class="btn btn-success">
            Add Flash Card
          </button>
        </form>
      </div>
    );
  }
  
  handleFileSelect(evt) {
      if (!evt.target.files[0].name.includes("yaml") || !evt.target.files[0].name.includes("yml")) {
        alert("Please submit a valid yaml file")
      }
      var reader = new FileReader();
  
      // file reading started
      reader.addEventListener('loadstart', function() {
          console.log('File reading started');
      });
    
      // file reading finished successfully
      reader.addEventListener('load', e => this.handleFileLoad(e));
      // file reading failed
      reader.addEventListener('error', function() {
          alert('Error : Failed to read file');
      });
      
      reader.readAsText(evt.target.files[0]);
  }

  handleFileLoad(e) {
    var item = []
    this.setState({ text: yaml.safeLoad(e.target.result) });
    for (var key of Object.keys(this.state.text)) {
      console.log("key" + key)
      for (var key2 of Object.keys(this.state.text[key])) {
        console.log("key2" + key2)
        if (!key2.match('Weight') && !key2.match('Description') && !key2.match('KeyKnowledgeAreas') && !key2.match('Examples') && !key2.match('Key Knowledge Areas')) {
          console.log(this.state.text[key][key2])
          for (var i=0; i<this.state.text[key][key2]['Prompts'].length; i++) {
            item.push({
              front: this.state.text[key][key2]['Prompts'][i],
              back: this.state.text[key][key2]['Answers'][i],
              id: Date.now()
            });
          }
        }
      }
    }
    console.log(item)
    this.setState(state => ({
      items: state.items.concat(item),
    }));
  }

  getNew() {
    if (this.state.items.length > 1) {
      var randomChoice = Math.floor(Math.random()*this.state.items.length)
      while (randomChoice === this.state.currentItem) {
        randomChoice = Math.floor(Math.random()*this.state.items.length)
      }
      this.setState({ currentItem: randomChoice });
    }
  }

  flip() {
    console.log(this.state.showBack)
    if (this.state.showBack && this.state.items.length > 0) {
      this.setState({ showBack: false });
      document.getElementById("flashCardContainer").value = this.state.items[this.state.currentItem].front
    }
    else if (!this.state.showBack && this.state.items.length > 0) {
      this.setState({ showBack: true });
      document.getElementById("flashCardContainer").value = this.state.items[this.state.currentItem].back
    }
  }

  handleChange(e) {
    console.log(e)
    this.setState({ text: e.target.value });
  }

  randomColour() { 
    var letters = ['AliceBlue', 'Beige', 'Bisque', 'AntiqueWhite', 'BurlyWood', 'Cornsilk', 'Gainsboro', 'LightSteelBlue', 'Moccasin', 'Thistle']
    var color = letters[Math.floor(Math.random() * letters.length)];
    document.getElementById('flashCardContainer').style.background = color; 
  }

  handleSubmit(e) {
    e.preventDefault();
    if (document.getElementById("new-flashcard-front").value.length === 0 || document.getElementById("new-flashcard-back").value.length === 0) {
      alert("Please complete both fields")
      return;
    }
    this.randomColour() 
    this.setState({ currentItem: Math.floor(Math.random()*this.state.items.length) });
    const newItem = {
      front: document.getElementById("new-flashcard-front").value,
      back: document.getElementById("new-flashcard-back").value,
      id: Date.now()
    };
    document.getElementById("new-flashcard-front").value = ""
    document.getElementById("new-flashcard-back").value = ""
    this.setState(state => ({
      items: state.items.concat(newItem),
    }));
  }
}

class FlashCardList extends React.Component {

  render() {
    if (this.props.items.length > 0) {
      
      if (this.props.showBack === false) {
        return (
          <textarea class="form-control text-center" id="flashCardContainer" 
            value={this.props.items[this.props.currentItem].front} style={this.props.style} disabled>
          </textarea>
        );
      }
      else if (this.props.showBack === true) {
        return (
          <textarea class="form-control text-center" id="flashCardContainer" 
              value={this.props.items[this.props.currentItem].back} style={this.props.style} disabled>
          </textarea>
        
        );
      }   
    }
    else {
      return (
        <textarea class="form-control text-center" id="flashCardContainer" style={this.props.style} disabled>
        </textarea>
        
      );
    }
  }

}

export default FlashCardApp;