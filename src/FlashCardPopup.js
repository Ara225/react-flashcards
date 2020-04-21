import React from 'react';

/**
 * Render the flash card popup
 */
class FlashCardPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items, showBack: false, currentItem: 0, text: null, currentItemWasSet: false,
            style: { "paddingTop": "15%", "paddingBottom": "15%", "paddingLeft": "15%", "paddingRight": "15%", "fontSize": "40px" }
        };
        this.flip = this.flip.bind(this);
        this.getNew = this.getNew.bind(this);
        this.getPrevious = this.getPrevious.bind(this);
        this.getNext = this.getNext.bind(this);
    }

    render() {
        if (this.state.items.length > 0) {
            // Bodge to get this working so we don't always start with flash card 0
            //if (this.state.currentItemWasSet === false) {
            //    var randomChoice = Math.floor(Math.random() * this.state.items.length)
            //    this.setState({ currentItem: randomChoice, currentItemWasSet: true });
            //}
            if (this.state.showBack === false) {
                return (
                    <div>
                        <div class="text-center form-group">
                            <textarea className="form-control text-center" id="flashCardContainer"
                                value={this.state.items[this.state.currentItem].front} style={this.state.style} disabled>
                            </textarea>
                            <br />
                            <button class="btn btn-info" onClick={this.getPrevious}>
                                Previous Flashcard
                            </button>
                            &nbsp; &nbsp;
                            <button class="btn btn-primary" onClick={this.getNew}>
                                Random Flashcard
                            </button>
                            &nbsp; &nbsp;
                            <button class="btn btn-info" onClick={this.getNext}>
                                Next Flashcard
                            </button>
                        </div>
                        <div onClick={this.flip} style={{"width":"99%","position":"absolute", "top":"5px", "left":"5px","height":"80%"}} >
                        </div>
                    </div>
                );
            }
            else if (this.state.showBack === true) {
                return (
                    <div>
                        <div class="text-center form-group">
                            <textarea className="form-control text-center" id="flashCardContainer"
                                value={this.state.items[this.state.currentItem].back} style={this.state.style} disabled>
                            </textarea>
                            <br />
                            <button class="btn btn-info" onClick={this.getPrevious}>
                                Previous Flashcard
                            </button>
                            &nbsp; &nbsp;
                            <button class="btn btn-primary" onClick={this.getNew}>
                                Random Flashcard
                            </button>
                            &nbsp; &nbsp;
                            <button class="btn btn-info" onClick={this.getNext}>
                                Next Flashcard
                            </button>
                        </div>
                        <div onClick={this.flip} style={{"width":"99%","position":"absolute", "top":"5px", "left":"5px","height":"80%"}} >
                        </div>
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

    getNext() {
        if (this.state.items.length > 0 && this.state.currentItem+1 <= this.state.items.length-1) {
            this.setState({ showBack: false });
            this.setState({ currentItem: this.state.currentItem+1 });
            this.randomColour()
        }
    }

    getPrevious() {
        if (this.state.items.length > 0 && this.state.currentItem !== 0) {
            this.setState({ showBack: false });
            this.setState({ currentItem: this.state.currentItem-1 });
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