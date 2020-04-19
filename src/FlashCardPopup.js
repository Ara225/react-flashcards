import React from 'react';

/**
 * Render the flash card popup
 */
class FlashCardPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items, showBack: false, currentItem: 0, text: null,
            style: { "paddingTop": "15%", "paddingBottom": "15%", "paddingLeft": "15%", "paddingRight": "15%", "fontSize": "40px" }
        };
        this.flip = this.flip.bind(this);
        this.getNew = this.getNew.bind(this);
    }

    render() {
        if (this.state.items.length > 0) {

            if (this.state.showBack === false) {
                return (
                    <div class="text-center form-group">
                        <textarea className="form-control text-center" id="flashCardContainer"
                            value={this.state.items[this.state.currentItem].front} style={this.state.style} disabled>
                        </textarea>
                        <br />
                        <button class="btn btn-primary" onClick={this.flip}>
                            Flip Flash Card
                        </button>
                        &nbsp; &nbsp;
                        <button class="btn btn-info" onClick={this.getNew}>
                            Another Flash Card
                        </button>
                    </div>
                );
            }
            else if (this.state.showBack === true) {
                return (
                    <div class="text-center form-group">
                        <textarea className="form-control text-center" id="flashCardContainer"
                            value={this.state.items[this.state.currentItem].back} style={this.state.style} disabled>
                        </textarea>
                        <br />
                        <button class="btn btn-primary" onClick={this.flip}>
                            Flip Flash Card
                        </button>
                        &nbsp; &nbsp;
                        <button class="btn btn-info" onClick={this.getNew}>
                            Another Flash Card
                        </button>
                    </div>
                );
            }
        }
        else {
            return (
                <h5 className="text-center">Error: No Flashcards added yet</h5>
            );
        }
    }

    /**
     * Get a new random flash card not the same as the previous one
     */
    getNew() {
        if (this.state.items.length > 1) {
            this.setState({ showBack: false });
            var randomChoice = Math.floor(Math.random() * this.state.items.length)
            while (randomChoice === this.state.currentItem) {
                randomChoice = Math.floor(Math.random() * this.state.items.length)
            }
            this.setState({ currentItem: randomChoice });
            this.randomColour()
        }
    }

    /**
     * Flip the flash card 
     */
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

    /**
     * Set the background color of the flashCard Container randomly
     */
    randomColour() {
        var colors = ['AliceBlue', 'Beige', 'Bisque', 'AntiqueWhite', 'BurlyWood', 'Cornsilk', 'Gainsboro', 'LightSteelBlue', 'Moccasin', 'Thistle']
        var color = colors[Math.floor(Math.random() * colors.length)];
        document.getElementById('flashCardContainer').style.background = color;
    }

}

export default FlashCardPopup;