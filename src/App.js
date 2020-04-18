import React from 'react';



class FlashCardApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], showBack: false, currentItem: 0, 
      style: {"paddingTop": "15%", "paddingBottom": "15%", "paddingLeft": "15%", "paddingRight": "15%"} };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.flip = this.flip.bind(this);
    this.getNew = this.getNew.bind(this);
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
            New Flash Card
          </button>
        </div>
        <br/>
        <h3 class="text-center">Add New Flash Cards</h3>
        <form onSubmit={this.handleSubmit} class="form-group">
          <input class="form-control" id="new-flashcard-front" placeholder="Front of Flash Card"/>
          <input class="form-control" id="new-flashcard-back"placeholder="Back of Flash Card"/>
          <br/>
          <button class="btn btn-success">
            Add Flash Card
          </button>
        </form>
      </div>
    );
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

  handleSubmit(e) {
    e.preventDefault();
    if (document.getElementById("new-flashcard-front").value.length === 0 || document.getElementById("new-flashcard-back").value.length === 0) {
      alert("Please complete both fields")
      return;
    }
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