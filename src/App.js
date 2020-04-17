import React from 'react';
import './App.css';


class FlashCardApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      
      <div class="container col-8">
        <br/>
        <h3 class="text-center">Flash Cards</h3>
        <br/>
        <FlashCardList items={this.state.items} />
        <form onSubmit={this.handleSubmit} class="form-group">
          <label htmlFor="new-flashcard-front">
            Front of Flash Card
          </label>
          <input class="form-control"
            id="new-flashcard-front"
          />
          <label htmlFor="new-flashcard-back">
            Back of Flash Card
          </label>
          <input class="form-control"
            id="new-flashcard-back"
          />
          <br/>
          <button class="btn btn-success">
            Add Flash Card
          </button>
        </form>
      </div>
    );
  }

  handleChange(e) {
    console.log(e)
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (document.getElementById("new-flashcard-front").value.length === 0 && document.getElementById("new-flashcard-back").value.length === 0) {
      return;
    }
    const newItem = {
      front: document.getElementById("new-flashcard-front").value,
      back: document.getElementById("new-flashcard-back").value,
      id: Date.now()
    };
    this.setState(state => ({
      items: state.items.concat(newItem),
    }));
  }
}

class FlashCardList extends React.Component {
  render() {
    return (
    <div class="container col-6 rounded form-control" style={{"paddingTop": "10%", "paddingBottom": "10%", "paddingLeft": "5%", "paddingRight": "5%"}}>
        {this.props.items.map(item => (
          <p key={item.id}>{item.front}</p>
        ))}
    </div>
    );
  }
}

export default FlashCardApp;