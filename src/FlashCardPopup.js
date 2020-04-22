import React from 'react';

/**
 * Class to render the flash card popup
 */
class FlashCardPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items, showBack: false, currentItem: 0, text: null, currentItemWasSet: false, flashCardsLearnt: [],
            stopSpeaking: false
        };
        this.learntFlashcard = this.learntFlashcard.bind(this);
        this.flip = this.flip.bind(this);
        this.getNew = this.getNew.bind(this);
        this.getPrevious = this.getPrevious.bind(this);
        this.getNext = this.getNext.bind(this);
        this.readFlashcardsAloud = this.readFlashcardsAloud.bind(this);
    }

    render() {
        if (this.state.items.length > 0) {
            var click
            var text
            if (this.state.stopSpeaking === false) {
                click = () => this.readFlashcardsAloud()
                text = "🔊"
            }
            else {
                click = () => {this.setState({ stopSpeaking: true });}
                text = "▐▐"
            }
            // Bodge to get this working so we don't always start with flash card 0 - not needed now
            //if (this.state.currentItemWasSet === false) {
            //    var randomChoice = Math.floor(Math.random() * this.state.items.length)
            //    this.setState({ currentItem: randomChoice, currentItemWasSet: true });
            //}
            var sideCurrentlyNeeded
            if (this.state.showBack === false) {
                sideCurrentlyNeeded = this.state.items[this.state.currentItem].front
            }
            else if (this.state.showBack === true) {
                sideCurrentlyNeeded = this.state.items[this.state.currentItem].back
            }
            return (
                <div>
                    <textarea className="form-control text-center flashcardTextareaSection" id="flashCardContainer"
                        value={sideCurrentlyNeeded} disabled>
                    </textarea>
                    <div onClick={this.flip} className="flashcardStatusSection" >
                        &nbsp; On: {this.state.currentItem+1}/{this.state.items.length}        
                        &nbsp; Learnt: {this.state.flashCardsLearnt.length}/{this.state.items.length}
                    </div>
                    <div >
                        <button class="btn readFlashcardsBtnSection" id="readFlashcardsBtn" onClick={click}>
                            {text}                          
                        </button>
                    </div>
                    <div className="text-center movementBtnsSection" >
                        <button class="btn btn-primary" onClick={this.getPrevious}>
                            &lang;
                        </button>
                        &nbsp; &nbsp;
                        <button class="btn btn-success" onClick={this.learntFlashcard}>
                            &#10003; Learnt
                        </button>
                        &nbsp; &nbsp;
                        <button class="btn btn-primary" onClick={this.getNext}>                          
                            &rang;
                        </button>
                        <br/>
                    </div>
                </div>
            );
        }
        else {
            return (
                <h5 className="text-center">Error: No Flashcards added yet</h5>
            );
        }
    }

    /**
     * Get a new random flash card not the same as the previous one Not using now, but want to use again
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
     * Set this.state.currentItem to the next card and ensure that it shows the front
     */
    getNext() {
        if (this.state.items.length > 0 && this.state.currentItem+1 <= this.state.items.length-1) {
            this.setState({ currentItem: this.state.currentItem+1, showBack: false });
            this.randomColour()
        }
    }
    /**
     * Set this.state.currentItem to the previous card and ensure that it show the front
     */
    getPrevious() {
        if (this.state.items.length > 0 && this.state.currentItem !== 0) {
            this.setState({ currentItem: this.state.currentItem-1, showBack: false });
            this.randomColour()
        }
    }

    /**
     * Increment the number of flashcards learnt, set this.state.currentItem to the next card, and ensure that it flips to the front
     */
    learntFlashcard() {
        this.setState({ currentItem: this.state.currentItem+1, flashCardsLearnt: this.state.flashCardsLearnt+[this.state.currentItem], showBack: false });
        this.randomColour()
    }

    async readFlashcardsAloud(e) {
        document.getElementById("readFlashcardsBtn").innerHTML = "&#9616;&#9616;"
        document.getElementById("readFlashcardsBtn").addEventListener("click", () => {this.setState({ stopSpeaking: true });})
        if (this.state.currentItem+1 === this.state.items.length) {
            this.setState({ currentItem: 0 });
        }
        // Different browsers handle this differently so doing this after there has been some interaction and earlier when we started 
        // the app seems to be the only way of getting all our bases covered
        try {
            var available_voices;
            window.speechSynthesis.getVoices()
            // list of languages is probably not loaded, wait for it
            if(window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.addEventListener('voiceschanged', function() {
                    available_voices = window.speechSynthesis.getVoices();
                });
            }
            else {
                available_voices = window.speechSynthesis.getVoices();
            }
    
            // this will hold an english voice
            var english_voice = '';
        
            // find voice by language locale "en-US"
            // if not then select the first voice
            for(var i=0; i<available_voices.length; i++) {
                if(available_voices[i].lang === 'en-US') {
                    english_voice = available_voices[i];
                    break;
                }
            }
            if(english_voice === '') {
                english_voice = available_voices[0];
            }
            // new SpeechSynthesisUtterance object - setup to speak basically
            var utter = new SpeechSynthesisUtterance();
            utter.rate = 1;
            utter.pitch = 0.5;
            utter.voice = english_voice;
        }
        catch(e) {
            alert("Error: Unable to load voices due to an unexpected error.")
            return
        }

        // Really really dirty tricks here Basically this.state.stopSpeaking is used to tell it to break when the button is clicked
        // and window window.speechSynthesis.speaking tells it if it's currently speaking. We need to simply insert a little delay 
        // so that the user can reflect on the flashcard so we need to use the bodge of the sleep function below
        for (var item = this.state.currentItem; item<this.state.items.length; item++) {
            utter.text = this.state.items[this.state.currentItem].front;
            window.speechSynthesis.speak(utter);
            while (true) {
                if (window.speechSynthesis.speaking && !this.state.stopSpeaking) {
                    await this.sleep(100)
                }
                else if (this.state.stopSpeaking) {
                    // Cancel speech
                    window.speechSynthesis.cancel()
                    // Reset button to original state
                    document.getElementById("readFlashcardsBtn").innerHTML = "🔊"
                    document.getElementById("readFlashcardsBtn").addEventListener("click", () => {this.readFlashcardsAloud()})
                    // So user can restart speech
                    this.setState({ stopSpeaking: false })
                    return
                }
                else {
                    await this.sleep(2000)
                    break
                }
            }
            // flip flashcard, read other side
            this.flip()
            utter.text = this.state.items[this.state.currentItem].back;
            window.speechSynthesis.speak(utter);
            while (true) {
                console.log(window.speechSynthesis.speaking)
                if (window.speechSynthesis.speaking && !this.state.stopSpeaking) {
                    await this.sleep(100)
                }
                else if (this.state.stopSpeaking) {
                        window.speechSynthesis.cancel()
                        document.getElementById("readFlashcardsBtn").innerHTML = "🔊"
                        document.getElementById("readFlashcardsBtn").addEventListener("click", () => {this.readFlashcardsAloud()})
                        this.setState({ stopSpeaking: false })
                        return
                    }
                else {
                    await this.sleep(3000)
                    this.getNext()
                    break
                }
            }
        }
    }

    /**
     * 
     * @param {int} time Milliseconds to sleep for
     */
    sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
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
     * Set the background color of the flashCard container randomly
     */
    randomColour() {
        var colors = ['AliceBlue', 'Beige', 'Bisque', 'AntiqueWhite', 'BurlyWood', 'Cornsilk', 'Gainsboro', 'LightSteelBlue', 'Moccasin', 'Thistle']
        var color = colors[Math.floor(Math.random() * colors.length)];
        document.getElementById('flashCardContainer').style.background = color;
    }

}

export default FlashCardPopup;