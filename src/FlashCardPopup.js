import React from 'react';
import { FAILSAFE_SCHEMA } from 'js-yaml';

/**
 * Render the flash card popup
 */
class FlashCardPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.props.items, showBack: false, currentItem: 0, text: null, currentItemWasSet: false, flashCardsLearnt: [],
            style: { "paddingTop": "15%", "paddingBottom": "15%", "paddingLeft": "15%", "paddingRight": "15%", "fontSize": "40px" },
            stopSpeaking: false
        };
        this.learntFlashcard = this.learntFlashcard.bind(this);
        this.flip = this.flip.bind(this);
        this.getNew = this.getNew.bind(this);
        this.getPrevious = this.getPrevious.bind(this);
        this.getNext = this.getNext.bind(this);
        this.readFlashcards = this.readFlashcards.bind(this);
    }

    render() {
        if (this.state.items.length > 0) {
            var click
            var text
            if (this.state.stopSpeaking === false) {
                click = () => this.readFlashcards()
                text = "🔊"
            }
            else {
                click = () => {this.setState({ stopSpeaking: true });}
                text = "▐▐"
            }
            // Bodge to get this working so we don't always start with flash card 0
            //if (this.state.currentItemWasSet === false) {
            //    var randomChoice = Math.floor(Math.random() * this.state.items.length)
            //    this.setState({ currentItem: randomChoice, currentItemWasSet: true });
            //}
            if (this.state.showBack === false) {
                return (
                    <div>
                        <textarea className="form-control text-center" id="flashCardContainer"
                            value={this.state.items[this.state.currentItem].front} style={this.state.style} disabled>
                        </textarea>
                        <div onClick={this.flip} style={{"width":"99%","position":"absolute", "top":"5px", "left":"5px","height":"80%"}} >
                            &nbsp; On: {this.state.currentItem+1}/{this.state.items.length}        
                            &nbsp; Learnt: {this.state.flashCardsLearnt.length}/{this.state.items.length}
                        </div>
                        <div style={{"position":"absolute", "top":"5px", "right":"10px"}} >
                            <button class="btn" id="readFlashcardsBtn" onClick={click}>
                                {text}                          
                            </button>
                        </div>
                        <div className="text-center" style={{"width":"99%","position":"absolute", "top":"85%", "left":"5px","height":"10%"}} >
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
            else if (this.state.showBack === true) {
                return (
                    <div>
                        <textarea className="form-control text-center" id="flashCardContainer"
                            value={this.state.items[this.state.currentItem].back} style={this.state.style} disabled>
                        </textarea>
                        <div onClick={this.flip} style={{"width":"99%","position":"absolute", "top":"5px", "left":"5px","height":"80%"}} >
                            &nbsp; On: {this.state.currentItem+1}/{this.state.items.length}    
                            &nbsp; Learnt: {this.state.flashCardsLearnt.length}/{this.state.items.length}
                        </div>
                        <div style={{"position":"absolute", "top":"5px", "right":"10px"}} >
                            <button class="btn" id="readFlashcardsBtn" onClick={click}>
                                {text}                          
                            </button>
                        </div>
                        <div className="text-center" style={{"width":"99%","position":"absolute", "top":"85%", "left":"5px","height":"10%"}} >
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
            this.setState({ currentItem: this.state.currentItem+1, showBack: false });
            this.randomColour()
        }
    }

    getPrevious() {
        if (this.state.items.length > 0 && this.state.currentItem !== 0) {
            this.setState({ currentItem: this.state.currentItem-1, showBack: false });
            this.randomColour()
        }
    }

    learntFlashcard() {
        this.setState({ currentItem: this.state.currentItem+1, flashCardsLearnt: this.state.flashCardsLearnt+[this.state.currentItem], showBack: false });
        this.randomColour()
    }

    async readFlashcards(e) {
        document.getElementById("readFlashcardsBtn").innerHTML = "&#9616;&#9616;"
        document.getElementById("readFlashcardsBtn").addEventListener("click", () => {this.setState({ stopSpeaking: true });})
        if (this.state.currentItem+1 === this.state.items.length) {
            this.setState({ currentItem: 0 });
        }
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
        if(english_voice === '')
            english_voice = available_voices[0];
        // new SpeechSynthesisUtterance object
        var utter = new SpeechSynthesisUtterance();
        utter.rate = 1;
        utter.pitch = 0.5;
        utter.voice = english_voice;

        // Really really dirty tricks here 
        for (var item = this.state.currentItem; item<this.state.items.length; item++) {
            utter.text = this.state.items[this.state.currentItem].front;
            window.speechSynthesis.speak(utter);
            while (true) {
                console.log(window.speechSynthesis.speaking)

                if (window.speechSynthesis.speaking && !this.state.stopSpeaking) {
                    await this.sleep(100)
                }
                else {
                    if (this.state.stopSpeaking) {
                        window.speechSynthesis.cancel()
                        document.getElementById("readFlashcardsBtn").innerHTML = "🔊"
                        document.getElementById("readFlashcardsBtn").addEventListener("click", () => {this.readFlashcards()})
                        this.setState({ stopSpeaking: false })
                        return
                    }
                    else {
                        await this.sleep(2000)
                        break
                    }
                }
            }
            this.flip()
            utter.text = this.state.items[this.state.currentItem].back;
            window.speechSynthesis.speak(utter);
            while (true) {
                console.log(window.speechSynthesis.speaking)
                if (window.speechSynthesis.speaking && !this.state.stopSpeaking) {
                    await this.sleep(100)
                }
                else {
                    if (this.state.stopSpeaking) {
                        window.speechSynthesis.cancel()
                        document.getElementById("readFlashcardsBtn").innerHTML = "🔊"
                        document.getElementById("readFlashcardsBtn").addEventListener("click", () => {this.readFlashcards()})
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